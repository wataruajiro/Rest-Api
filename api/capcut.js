const { capcut } = require('betabotz-tools');

exports.config = {
    name: 'capcut',
    author: '',
    description: 'CapCut video downloader API',
    category: 'tools',
    usage: ['/capcut?url=']
};

exports.initialize = async function ({ req, res }) {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const results = await capcut(url);
        console.log(results);
        res.json(results);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
