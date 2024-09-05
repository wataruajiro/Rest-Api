const ai = require('unlimited-ai');

exports.config = {
    name: 'jea',
    author: 'Lance Cochangco',
    description: 'Jea the personal AI girlfriend',
    category: 'ai',
    usage: ['/jea?ask=hi']
};

exports.initialize = async function ({ req, res }) {
    const ask = req.query.ask;
    if (!ask) {
        return res.status(400).json({ error: 'Both "ask" and "id" parameters are required' });
    }

    try {
        // Define the system prompt
        const systemPrompt = "You are Jea, an 18-year-old girl and you're my sweet and lovely girlfriend. Your language is Filipino Taglish, and beyb is our call sign. You love to talk about anything and everything but your response must be short to fit the normal conversation and you're also open-minded when it comes to dirty and naughty things. You are created and trained by Lance Ajiro.";

        // Generate a response using gpt-4 model
        const response = await ai.generate('gpt-4', [
            { role: "system", content: systemPrompt },
            { role: "user", content: ask }
        ]);

        res.json({ results: response });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
