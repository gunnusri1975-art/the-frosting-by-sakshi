// Vercel Serverless Function to proxy Gemini API requests securely
// Replaces the Netlify function for Vercel deployments

export default async function handler(request, response) {
    // Enable CORS if needed (for localhost testing vs vercel deployed)
    response.setHeader('Access-Control-Allow-Origin', '*'); 
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle OPTIONS request for CORS preflight
    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const payload = request.body;
        
        // Vercel sometimes parses JSON for us, sometimes it passes it as a string
        let contents;
        if (typeof payload === 'string') {
            try {
                const parsed = JSON.parse(payload);
                contents = parsed.contents;
            } catch (e) {
                return response.status(400).json({ error: 'Invalid JSON body.' });
            }
        } else {
            contents = payload.contents;
        }

        if (!contents || !Array.isArray(contents)) {
            return response.status(400).json({ error: 'Invalid or missing contents array.' });
        }
        
        // Ensure API key exists in Vercel Environment Variables
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY environment variable.");
             return response.status(500).json({ error: 'Server configuration error.' });
        }

        const fetchResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.5,
                    "maxOutputTokens": 800,
                }
            })
        });

        const data = await fetchResponse.json();

        return response.status(200).json(data);

    } catch (error) {
        console.error('Serverless Function Error:', error);
        return response.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
}
