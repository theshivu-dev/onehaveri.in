// functions/api/blood-stock.js
// Cloudflare Pages Function
//
// OneHaveri calls this endpoint once per blood component. Keeping each
// request component-specific avoids sending many simultaneous requests to
// eRaktKosh, while still allowing the page to build one complete Haveri view.

const STATE_CODE = 29;   // Karnataka
const DISTRICT_ID = 564; // Haveri
const CACHE_SECONDS = 900; // 15 minutes
const UPSTREAM_TIMEOUT_MS = 12000;
const UPSTREAM_RETRIES = 3;
const UPSTREAM_RETRY_DELAY_MS = 750;

const COMPONENTS = {
  11: 'Whole Blood',
  12: 'Packed Red Blood Cells',
  13: 'Fresh Frozen Plasma',
  14: 'Single Donor Platelet',
  16: 'Platelet Rich Plasma',
  17: 'Cryoprecipitate',
  18: 'Single Donor Plasma',
  19: 'Plasma',
  20: 'Platelet Concentrate',
  21: 'Cryo Poor Plasma',
  23: 'Random Donor Platelets',
  28: 'Sagm Packed Red Blood Cells',
  29: 'Irradiated RBC',
  30: 'Leukoreduced Rbc'
};

function jsonResponse(body, status = 200, cacheSeconds = CACHE_SECONDS) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': `public, max-age=${cacheSeconds}`
    }
  });
}

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

// Example: "B+Ve : 74, O-Ve : 4" -> { "B+Ve": 74, "O-Ve": 4 }
function parseGroupQtyString(str) {
  const map = {};
  if (!str) return map;

  str.split(',').forEach(part => {
    const match = part.trim().match(/^(.+?)\s*:\s*(\d+)$/);
    if (match) map[match[1].trim()] = parseInt(match[2], 10);
  });

  return map;
}

function sumQuantities(groups) {
  return Object.values(groups).reduce((sum, qty) => sum + qty, 0);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function shouldRetryStatus(status) {
  return status === 502 || status === 503 || status === 504 || status === 522;
}

async function fetchComponent(code) {
  const url =
    `https://eraktkosh.mohfw.gov.in/eraktkoshPortal/eraktkosh/blood-availability` +
    `?stateCode=${STATE_CODE}&districtId=${DISTRICT_ID}&componentId=${code}`;

  let lastError = null;
  const attempts = [];

  for (let attempt = 1; attempt <= UPSTREAM_RETRIES; attempt += 1) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);
    const attemptInfo = { attempt };

    try {
      attemptInfo.phase = 'fetch';

      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9,en-IN;q=0.8',
          'Referer': 'https://eraktkosh.mohfw.gov.in/eraktkoshPortal/',
          'User-Agent': 'Mozilla/5.0 (compatible; oneHaveriBot/1.0; +https://onehaveri.in)'
        },
        signal: controller.signal
      });

      attemptInfo.httpStatus = res.status;
      attemptInfo.ok = res.ok;

      if (res.ok) {
        attemptInfo.phase = 'json';
        const data = await res.json();
        attemptInfo.phase = 'validated';
        attemptInfo.result = 'success';
        attempts.push(attemptInfo);

        if (!Array.isArray(data)) {
          const formatError = new Error('eRaktKosh returned an unexpected response format');
          formatError.diagnostic = {
            phase: 'json-validation',
            attempts
          };
          throw formatError;
        }

        return data;
      }

      lastError = new Error(`eRaktKosh returned HTTP ${res.status}`);
      attemptInfo.result = 'http-error';
      attemptInfo.retryable = shouldRetryStatus(res.status);
      attempts.push(attemptInfo);

      if (!shouldRetryStatus(res.status) || attempt === UPSTREAM_RETRIES) {
        lastError.diagnostic = {
          phase: 'upstream-http',
          attempts
        };
        throw lastError;
      }
    } catch (error) {
      if (!attempts.includes(attemptInfo)) {
        if (error && error.name === 'AbortError') {
          lastError = new Error(`eRaktKosh request timed out after ${UPSTREAM_TIMEOUT_MS / 1000}s`);
          attemptInfo.result = 'timeout';
        } else {
          lastError = error;
          attemptInfo.result = 'network-or-runtime-error';
        }
        attemptInfo.errorName = error && error.name ? error.name : 'Error';
        attemptInfo.errorMessage = error && error.message ? error.message : String(error);
        attempts.push(attemptInfo);
      }

      if (attempt === UPSTREAM_RETRIES) {
        if (!lastError) lastError = new Error('eRaktKosh request failed');
        lastError.diagnostic = lastError.diagnostic || {
          phase: 'fetch',
          attempts
        };
        throw lastError;
      }
    } finally {
      clearTimeout(timeoutId);
    }

    await sleep(UPSTREAM_RETRY_DELAY_MS * attempt);
  }

  const fallbackError = lastError || new Error('eRaktKosh request failed');
  fallbackError.diagnostic = fallbackError.diagnostic || {
    phase: 'fetch',
    attempts
  };
  throw fallbackError;
}

function buildComponentDataset(code, hospitals) {
  const label = COMPONENTS[code];
  const rows = [];
  const availableTotals = {};
  let banksWithStock = 0;

  hospitals.forEach(hospital => {
    const componentKeys = Object.keys(hospital.components || {});
    const componentLabel = componentKeys[0] || label;
    const componentData = hospital.components
      ? hospital.components[componentLabel]
      : null;

    if (!componentData) return;

    const availableGroups = parseGroupQtyString(componentData.available_WithQty);
    const notAvailableGroups = parseGroupQtyString(componentData.not_available_WithQty);
    const allGroups = Object.assign({}, notAvailableGroups, availableGroups);
    const availableUnits = sumQuantities(availableGroups);
    const hasStock = availableUnits > 0;

    if (hasStock) banksWithStock += 1;

    Object.entries(allGroups).forEach(([group, qty]) => {
      if (!Object.prototype.hasOwnProperty.call(availableTotals, group)) {
        availableTotals[group] = 0;
      }
      availableTotals[group] += availableGroups[group] || 0;
    });

    const contact = parseContact(hospital.hospitalcontact);

    rows.push({
      bankName: hospital.hospitalname || '',
      bankAddress: hospital.hospitaladd || '',
      bankPhone: contact.phone,
      bankEmail: contact.email,
      category: hospital.hospitalType || '',
      component: componentLabel,
      availability: hasStock ? 'Available' : 'Not Available',
      availableUnits,
      groups: allGroups,
      lastUpdated: hospital.entrydate || '',
      type: hospital.type || ''
    });
  });

  return {
    componentId: Number(code),
    component: label,
    totalBanks: rows.length,
    banksWithStock,
    availableTotals,
    rows
  };
}

export async function onRequestGet(context) {
  const requestUrl = new URL(context.request.url);
  const componentId = requestUrl.searchParams.get('componentId');

  if (!componentId || !Object.prototype.hasOwnProperty.call(COMPONENTS, componentId)) {
    return jsonResponse({
      error: 'A valid componentId is required.',
      allowedComponentIds: Object.keys(COMPONENTS).map(Number),
      example: '/api/blood-stock?componentId=12'
    }, 400, 0);
  }

  const cacheKey = new Request(requestUrl.toString(), { method: 'GET' });
  const cache = caches.default;
  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse) return cachedResponse;

  try {
    const hospitals = await fetchComponent(componentId);
    const dataset = buildComponentDataset(componentId, hospitals);

    const response = jsonResponse({
      generatedAt: new Date().toISOString(),
      source: 'eRaktKosh',
      stateCode: STATE_CODE,
      districtId: DISTRICT_ID,
      ...dataset
    });

    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    const diagnostic = error && error.diagnostic ? error.diagnostic : {
      phase: 'unknown',
      attempts: []
    };

    return jsonResponse({
      generatedAt: new Date().toISOString(),
      source: 'eRaktKosh',
      componentId: Number(componentId),
      component: COMPONENTS[componentId],
      error: String(error && error.message ? error.message : error),
      diagnostic
    }, 502, 0);
  }
}
