const express = require('express');
const axios = require('axios');
const app = express();

const TARGET_URL = 'https://www.abhyas.ai'; 

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="margin:0; background:#111; color:white; font-family:sans-serif; overflow:hidden;">
                <div style="height:50px; display:flex; align-items:center; padding:0 20px; background:#222; gap:20px;">
                    <button onclick="startBot()" style="background:#28a745; color:white; border:none; padding:10px; border-radius:5px; cursor:pointer; font-weight:bold;">▶ START BOT</button>
                    <span id="status">Status: Ready</span>
                </div>
                <img id="cursor" src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Mouse_cursor_arrow.svg" style="position:absolute; width:25px; z-index:9999; transition:all 1s; pointer-events:none;">
                <iframe id="frame" src="/proxy" style="width:100%; height:calc(100vh - 50px); border:none; background:white;"></iframe>
                
                <script>
                    async function startBot() {
                        const frame = document.getElementById('frame');
                        const cursor = document.getElementById('cursor');
                        const doc = frame.contentDocument || frame.contentWindow.document;
                        document.getElementById('status').innerText = "Status: Searching...";

                        const target = doc.querySelector('input') || doc.querySelector('button');
                        if(target) {
                            const rect = target.getBoundingClientRect();
                            cursor.style.top = (rect.top + 60) + "px";
                            cursor.style.left = rect.left + "px";
                            document.getElementById('status').innerText = "Status: Bot Moving...";
                            
                            await new Promise(r => setTimeout(r, 1200));
                            target.focus();
                            document.getElementById('status').innerText = "Status: Bot Working!";
                        } else {
                            document.getElementById('status').innerText = "Status: Click into the site first.";
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
        const origin = new URL(TARGET_URL).origin;
        
        // This part was causing the error, fixed it here:
        html = html.split('src="/').join('src="' + origin + '/');
        html = html.split('href="/').join('href="' + origin + '/');

        res.setHeader('Content-Security-Policy', "frame-ancestors *");
        res.send(html);
    } catch (e) {
        res.send("Proxy Error: Site blocked. Try a different URL in server.js");
    }
});

app.listen(3000, () => console.log('SERVER IS LIVE ON PORT 3000'));
