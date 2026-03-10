require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

app.post('/api/chat', async (req, res) => {
    try {
        const { history } = req.body;

        if (!history || !Array.isArray(history)) {
            return res.status(400).json({ error: "Invalid history format" });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const model = "gemini-2.5-flash";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        // Format history for the raw API
        const contents = history.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.parts[0].text }]
        }));

        console.log(`Sending request to Gemini (${model})...`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents })
        });

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            res.json({ reply: data.candidates[0].content.parts[0].text });
        } else {
            console.error("Gemini Error Response:", JSON.stringify(data));
            res.status(500).json({ error: "Gemini API Error", details: data });
        }

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
