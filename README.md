# Online Gambling Blocker via Cloudflare Worker

This script filters application responses for forbidden keywords and blocks them with a Forbidden response.

## Features
1. **Whitelist Path**  
   - Skips specified paths from content checking, improving efficiency for non-critical pages.

2. **Content Filtering**  
   - Reads response content (text or JSON) and checks for forbidden keywords.
   - If forbidden keywords are found, the response is blocked with a **403 Forbidden** status.

3. **Efficient Handling**  
   - Binary responses (e.g., images) are passed through without checking.
   - Whitelisted paths bypass keyword checks entirely.

## Configuration
- **Forbidden Keywords**: Define in `forbiddenKeywords` array.
- **Whitelisted Paths**: Define in `whitelistPaths` array.

## Example
Whitelist paths:
```javascript
const whitelistPaths = ['/path1', '/path2', '/path3'];
```

Keywords:
```javascript
const forbiddenKeywords = ['gacor', 'slot', 'judi'];
```
