# YAZIO API Notes

## Overview
The YAZIO API is undocumented/private. The endpoints below are reverse-engineered from the mobile app.

## Base URL
```
https://api.yazio.com/v11
```

## Authentication
- Bearer token from YAZIO app session
- Extract from mobile app traffic (e.g., via mitmproxy or Charles Proxy)
- Token may expire — manual refresh required for now

## Known Endpoints (to be verified)

### Food Search
```
GET /foods/search?q={query}&limit={limit}
```

### Diary
```
GET /diary?date={YYYY-MM-DD}
POST /diary
DELETE /diary/{entry_id}
```

## Reverse Engineering Steps
1. Install mitmproxy or Charles Proxy
2. Configure device to use proxy with HTTPS interception
3. Open YAZIO app, perform actions (search food, add entry)
4. Capture and document request/response patterns
5. Update `src/lib/yazio/client.ts` with real endpoints

## Important Notes
- API may change without notice
- Rate limiting unknown — be conservative
- All nutrient values are per 100g in search results
- Diary entries store absolute nutrient amounts
