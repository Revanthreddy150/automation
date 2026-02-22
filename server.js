const express = require('express');
const axios = require('axios');
const app = express();

// Use the site you mentioned
const TARGET_URL = 'https://www.abhyas.ai'; 

app.use(express.static('.')); // Serves your index.html

app.get('/stream-site', async (req, res) => {
    try {
        const response = await axios.get(TARGET_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        
        let html = response.data;
        const origin = new URL(TARGET_URL).origin;

        // Fix images/links so they load from abhyas.ai instead of your server
        html = html.replace(/(src|href)="\//g, `$1="${origin}/`);

        // Strip security headers that prevent framing
        res.setHeader('Content-Security-Policy', "frame-ancestors *");
        res.setHeader('X-Frame-Options', 'ALLOWALL');
        res.send(html);
    } catch (error) {
        res.status(500).send("Error: Could not bridge the website.");
    }
});

app.listen(3000, () => console.log('System ready at http://localhost:3000'));
