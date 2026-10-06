from time import perf_counter

from workers import WorkerEntrypoint, Response, fetch


UPSTREAM_URL = (
    "https://eraktkosh.mohfw.gov.in/eraktkoshPortal/eraktkosh/"
    "blood-availability?stateCode=29&districtId=564&componentId=12"
)


class Default(WorkerEntrypoint):
    async def fetch(self, request):
        started = perf_counter()

        try:
            upstream = await fetch(
                UPSTREAM_URL,
                method="GET",
                headers={
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "en-US,en;q=0.9,en-IN;q=0.8",
                    "Referer": "https://eraktkosh.mohfw.gov.in/eraktkoshPortal/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0.0.0 Safari/537.36",
                },
            )

            elapsed_ms = round((perf_counter() - started) * 1000, 1)
            body = await upstream.text()

            return Response.json(
                {
                    "test": "cloudflare-python-worker-eraktkosh",
                    "componentId": 12,
                    "component": "Packed Red Blood Cells",
                    "upstreamStatus": upstream.status,
                    "elapsedMs": elapsed_ms,
                    "contentType": upstream.headers.get("content-type"),
                    "responseBytes": len(body.encode("utf-8")),
                    "upstreamBody": body,
                },
                status=200 if upstream.ok else 502,
            )
        except Exception as exc:
            elapsed_ms = round((perf_counter() - started) * 1000, 1)
            return Response.json(
                {
                    "test": "cloudflare-python-worker-eraktkosh",
                    "componentId": 12,
                    "component": "Packed Red Blood Cells",
                    "upstreamStatus": None,
                    "elapsedMs": elapsed_ms,
                    "errorType": type(exc).__name__,
                    "error": str(exc),
                },
                status=502,
            )
