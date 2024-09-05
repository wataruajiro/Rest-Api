const axios = require('axios');
const encodeURIComponent = require('querystring').escape; // In case encodeURIComponent needs to be imported

exports.config = {
    name: 'gpt4o',
    author: 'Lance Cochangco',
    description: 'Fetches a response from the GPT-4 API with an optional context parameter',
    category: 'ai',
    usage: ['/gpt4o?context=hi']
};

exports.initialize = async function ({ req, res }) {
    try {
        // Check if 'context' query parameter is provided
        if (!req.query.context) {
            return res.status(400).json({
                status: false,
                message: "Usage: Please provide a query parameter 'context' with your input."
            });
        }

        const context = encodeURIComponent(req.query.context);
        const apiUrl = `https://api.kenliejugarap.com/freegpt4o8k/?question=${context}`;

        const response = await axios.get(apiUrl);

        const filteredResponse = {
            status: true,
            response: response.data.response.replace(/\n\nIs this answer helpful to you\? Kindly click the link below\nhttps:\/\/click2donate\.kenliejugarap\.com\n\(Clicking the link and clicking any ads or button and wait for 30 seconds \(3 times\) everyday is a big donation and help to us to maintain the servers, last longer, and upgrade servers in the future\)/, '').trim()
        };

        return res.json(filteredResponse);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};
