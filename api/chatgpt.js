const { G4F } = require("g4f");
const g4f = new G4F();

exports.config = {
    name: 'chatgpt',
    author: '',
    description: 'Generates a response from ChatGPT',
    category: 'ai',
    usage: ['/chatgpt?question=hi']
};

exports.initialize = async function ({ req, res }) {
    try {
        // Check if there is a query parameter named 'question'
        const question = req.query.question;
        if (!question) {
            return res.status(400).json({ error: "No question provided" });
        }

        // Define messages array with system and user messages
        const messages = [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: question }
        ];

        // Use the messages array in generating the response
        const chat = await g4f.chatCompletion(messages);

        // Send the AI's response as JSON
        res.json({ content: chat });
    } catch (error) {
        console.error("Error generating response:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
};
