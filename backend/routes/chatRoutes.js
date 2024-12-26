const express = require('express');
const axios = require('axios');
const Chat = require('../models/Chat');

const router = express.Router();

// POST /api/chats
router.post('/', async (req, res) => {
    const { message } = req.body;

    try {
        // Call OpenAI API
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: message },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const botResponse = response.data.choices[0].message.content;

        // Save chat to database
        const chat = new Chat({ userMessage: message, botResponse });
        await chat.save();

        res.json({ botResponse });
    } catch (error) {
        console.error('Error communicating with OpenAI:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to process the request' });
    }
});

module.exports = router;