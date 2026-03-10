require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/chat', async (req, res) => {
    try {
        const { history } = req.body;

        // Use the Gemini 1.5 Flash model
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Start a chat session with the provided history
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role,
                parts: msg.parts.map(part => ({ text: part.text }))
            })),
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 800,
            }
        });

        // The user's latest message should be the last one in the history
        // Wait, the client is sending the full history including the *new* user message.
        // We need to separate the history from the new message for `sendMessage`.

        // Actually, if the client sends what we need, let's extract the last user message
        const lastUserMessage = history[history.length - 1];

        // Remove the last user message from the history we pass to startChat
        const previousHistory = history.slice(0, history.length - 1);

        const configuredChat = model.startChat({
            history: previousHistory.map(msg => ({
                role: msg.role,
                parts: msg.parts.map(part => ({ text: part.text }))
            })),
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 800,
            }
        })

        const result = await configuredChat.sendMessage([{ text: lastUserMessage.parts[0].text }]);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
