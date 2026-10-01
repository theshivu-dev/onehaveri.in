// functions/api/blood-stock.js
//
// Cloudflare Pages Function — deploys automatically alongside your site.
// Runs on Cloudflare's servers (not the visitor's browser), so the eRaktKosh
// CORS header bug never comes into play here, exactly like the Python test.
//
// Once deployed, this is reachable at:
//   https://onehaveri.in/api/blood-stock
// Your HTML page just calls fetch('/api/blood-stock') — same-origin, no CORS.

const STATE_CODE = 29;   // Karnataka
const DISTRICT_ID = 564; // Haveri
const CACHE_SECONDS = 900; // 15 min edge cache, so we don't hit eRaktKosh on every single visitor

const COMPONENTS = {
  11: 'Whole Blood', 12: 'Packed Red Blood Cells', 13: 'Fresh Frozen Plasma',
  14: 'Single Donor Platelet', 16: 'Platelet Rich Plasma', 17: 'Cryoprecipitate',
  18: 'Single Donor Plasma', 19: 'Plasma', 20: 'Platelet Concentrate',
  21: 'Cryo Poor Plasma', 23: 'Random Donor Platelets', 28: 'Sagm Packed Red Blood Cells',
  29: 'Irradiated RBC', 30: 'Leukoreduced Rbc'
};

function parseContact(raw) {
  raw = raw || '';
  const phoneMatch = raw.match(/Phone:\s*([^,]+)/i);
  const emailMatch = raw.match(/Email:\s*([^\s,]+)/i);
  let phone = phoneMatch ? phoneMatch[1].trim() : null;
  let email = emailMatch ? emailMatch[1].trim() : null;
  if (phone === '-' || phone === '0' || phone === '') phone = null;
  if (email === '-' || email === '') email = null;
  return { phone, email };
}

function parseGroupQtyString(str) {
  const map = {};
  if (!str) return map;
  str.split(',').forEach(part => {
    const m = part.trim().match(/^(.+?)\s*:\s*(\d+)$/);
    if (m) map[m[1].trim()] = parseInt(m[2], 10);
  });
  return map;
}

async function fetchComponent(code) {
  const url = `https://eraktkosh.mohfw.gov.in/eraktkoshPortal/eraktkosh/blood-availability?stateCode=${STATE_CODE}&districtId=${DISTRICT_ID}&componentId=${code}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; oneHaveriBot/1.0; +https://onehaveri.in)' }
  });
  if (!res.ok) throw new Error(`Component ${code} failed: ${res.status}`);
  return await res.json();
}

async function buildDataset() {
  const rows = [];
  const componentTotals = {};
  let sno = 1;
  const codes = Object.keys(COMPONENTS);
  const errors = [];

  const results = await Promise.allSettled(codes.map(code => fetchComponent(code)));

  results.forEach((result, i) => {
    const code = codes[i];
    const fallbackLabel = COMPONENTS[code];

    if (result.status !== 'fulfilled' || !Array.isArray(result.value)) {
      errors.push({ componentId: code, label: fallbackLabel, error: String(result.reason || 'unknown') });
      return;
    }

    result.value.forEach(hospital => {
      const compKeys = Object.keys(hospital.components || {});
      const componentLabel = compKeys[0] || fallbackLabel;
      const compData = hospital.components ? hospital.components[componentLabel] : null;
      if (!compData) return;

      const available = parseGroupQtyString(compData.available_WithQty);
      const notAvailable = parseGroupQtyString(compData.not_available_WithQty);
      const allGroups = Object.assign({}, notAvailable, available);

      if (!componentTotals[componentLabel]) componentTotals[componentLabel] = {};
      Object.entries(allGroups).forEach(([group, qty]) => {
        componentTotals[componentLabel][group] = (componentTotals[componentLabel][group] || 0) + qty;
      });

      const contact = parseContact(hospital.hospitalcontact);

      rows.push({
        sno: sno++,
        bankName: hospital.hospitalname || '',
        bankAddress: hospital.hospitaladd || '',
        bankPhone: contact.phone,
        bankEmail: contact.email,
        category: hospital.hospitalType || '',
        component: componentLabel,
        groups: allGroups,
        lastUpdated: hospital.entrydate || '',
        type: hospital.type || ''
      });
    });
  });

  return { generatedAt: new Date().toISOString(), rows, componentTotals, errors };
}

export async function onRequestGet(context) {
  const cacheUrl = new URL(context.request.url);
  const cacheKey = new Request(cacheUrl.toString(), context.request);
  const cache = caches.default;

  // Serve from Cloudflare's edge cache if we have a recent copy
  let response = await cache.match(cacheKey);
  if (response) return response;

  const data = await buildDataset();

  response = new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': `public, max-age=${CACHE_SECONDS}`
    }
  });

  // Store in edge cache for next visitor, without blocking this response
  context.waitUntil(cache.put(cacheKey, response.clone()));

  return response;
}
