// Attach an event listener to handle 'fetch' events
addEventListener('fetch', event => {
    // Respond to the fetch event with the custom handleRequest function
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const url = new URL(request.url); // Parse the URL of the incoming request
    const path = url.pathname; // Extract the path from the URL

    // List of whitelisted paths (content check is skipped for these paths)
    const whitelistPaths = ['/path1', '/path2', '/path3'];

    // List of forbidden keywords to block if found in the content
    const forbiddenKeywords = ['gacor', 'slot', 'judi'];

    // If the request path is in the whitelist, return the original response without checking
    if (whitelistPaths.includes(path)) {
        return fetch(request);
    }

    // Fetch the original response from the origin server
    const response = await fetch(request);

    // Clone the response to read its content while preserving the original
    let responseClone = response.clone();
    let contentType = response.headers.get('Content-Type') || ''; // Get the Content-Type header

    let body; // Variable to store the response body

    // Parse the response body based on the content type
    if (contentType.includes('application/json')) {
        body = await responseClone.json(); // Parse JSON content
    } else if (contentType.includes('text')) {
        body = await responseClone.text(); // Parse plain text content
    } else {
        // If the content is not JSON or text, return the original response as is
        return response;
    }

    let containsForbidden = false; // Flag to check for forbidden keywords

    // Check for forbidden keywords in the response body
    if (typeof body === 'string') {
        // If the body is a string, directly search for forbidden keywords
        containsForbidden = forbiddenKeywords.some(keyword => body.includes(keyword));
    } else if (typeof body === 'object') {
        // If the body is an object (JSON), convert it to a string for keyword searching
        const bodyString = JSON.stringify(body);
        containsForbidden = forbiddenKeywords.some(keyword => bodyString.includes(keyword));
    }

    // If any forbidden keyword is found, block the response with a 403 status
    if (containsForbidden) {
        return new Response('Forbidden: Content blocked by Cloudflare Worker', { status: 403 });
    }

    // If no forbidden keywords are found, return the original response
    return response;
}
