exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const payload = JSON.parse(event.body);
        const { contents } = payload;

        if (!contents || !Array.isArray(contents)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid or missing contents array.' })
            };
        }
        
        // Ensure API key exists in Netlify Environment Variables
        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY environment variable.");
             return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Server configuration error.' })
            };
        }

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
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

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Serverless Function Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', message: error.message })
        };
    }
};
