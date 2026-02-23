app.get('/proxy', async (req, res) => {
    try {
        const response = await axios.get(TARGET_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5'
            }
        });
        
        let html = response.data;
        const origin = new URL(TARGET_URL).origin;
        
        // Better link fixing
        html = html.replace(/(src|href)="\//g, `$1="${origin}/`);

        res.setHeader('Content-Security-Policy', "frame-ancestors *");
        res.send(html);
    } catch (e) {
        // If it still fails, we will try a different proxy method
        res.send("Blocked by Site Security. Try changing TARGET_URL to 'https://www.wikipedia.org' to see the bot work first!");
    }
});
