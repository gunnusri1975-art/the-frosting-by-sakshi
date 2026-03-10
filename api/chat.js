const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: 'Invalid history format' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
        }

        const modelName = "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const contents = history.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.parts[0].text }]
        }));

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: 'Gemini API Error', details: data });
        }

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};
