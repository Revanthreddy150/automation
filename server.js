const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

// The real website you want to load
const TARGET_URL = 'https://example-education.com'; 

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="margin:0; overflow:hidden;">
                <div style="padding:10px; background:#222; color:white; display:flex; gap:10px;">
                    <button onclick="startBot()" style="padding:10px; cursor:pointer;">▶ RUN EXAM BOT</button>
                    <span>Status: <b id="bot-status">Idle</b></span>
                </div>
                <iframe id="target-frame" src="/proxy" style="width:100%; height:100vh; border:none;"></iframe>
                <script>
                    async function startBot() {
                        const frame = document.getElementById('target-frame');
                        const doc = frame.contentDocument || frame.contentWindow.document;
                        document.getElementById('bot-status').innerText = "Running...";
                        
                        // Bot Logic: Find the first input and type
                        const input = doc.querySelector('input');
                        if(input) {
                            input.focus();
                            input.value = "Automated Answer 101";
                            input.style.backgroundColor = "yellow";
                            document.getElementById('bot-status').innerText = "Success!";
                        } else {
                            document.getElementById('bot-status').innerText = "No input found!";
                        }
                    }
                </script>
            </body>
        </html>
    `);
});

app.get('/proxy', async (req, res) => {
    try {
        const response = await axios.get(TARGET_URL);
        let html = response.data;

        // THE FIX: Rewrite relative links (e.g., /style.css) to absolute links (https://site.com/style.css)
        // This ensures images, CSS, and JS load correctly from the original source.
        const origin = new URL(TARGET_URL).origin;
        html = html.replace(/(src|href)="\//g, `$1="${origin}/`);

        res.set('Content-Security-Policy', "frame-ancestors *");
        res.send(html);
    } catch (error) {
        res.status(500).send("Error fetching site.");
    }
});

app.listen(PORT, () => console.log(`Bot Server active at port ${PORT}`));
