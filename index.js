const login = require("fca-smart-shankar");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const htmlPage = `
<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elite Messenger Control</title>
    <style>
        :root { --primary: #00d2ff; --secondary: #3a7bd5; --dark: #121212; --card: #1e1e1e; }
        body { font-family: 'Segoe UI', sans-serif; background: var(--dark); color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
        .container { background: var(--card); padding: 40px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; max-width: 450px; border: 1px solid #333; }
        h2 { text-align: center; background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; margin-bottom: 20px; }
        label { font-size: 14px; color: #aaa; margin-top: 15px; display: block; }
        input, textarea { width: 100%; background: #2a2a2a; border: 1px solid #444; padding: 12px; border-radius: 10px; color: white; margin-top: 5px; box-sizing: border-box; transition: 0.3s; }
        input:focus, textarea:focus { border-color: var(--primary); outline: none; box-shadow: 0 0 10px rgba(0,210,255,0.2); }
        button { width: 100%; padding: 15px; margin-top: 25px; background: linear-gradient(to right, var(--primary), var(--secondary)); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
        button:hover { opacity: 0.9; transform: translateY(-2px); }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #555; }
    </style>
</head>
<body>
    <div class="container">
        <h2>System Control</h2>
        <form action="/start" method="POST">
            <label>Account AppState (JSON)</label>
            <textarea name="appstate" rows="4" placeholder="Paste JSON here..." required></textarea>
            
            <label>Target Name / Prefix</label>
            <input type="text" name="prefix" placeholder="Example: Hey Alex," required>
            
            <label>Loop Message</label>
            <textarea name="message" rows="2" placeholder="Your message here..." required></textarea>
            
            <label>Speed (Seconds)</label>
            <input type="number" name="delay" value="15" required>
            
            <button type="submit">Execute Attack</button>
        </form>
        <div class="footer">POWERED BY GEMINI AI CORE</div>
    </div>
</body>
</html>
`;

app.get('/', (req, res) => res.send(htmlPage));

app.post('/start', (req, res) => {
    const { appstate, prefix, message, delay } = req.body;
    try {
        const state = JSON.parse(appstate);
        login({ appState: state }, (err, api) => {
            if (err) return res.send(`<h2>Login Failed</h2><p>${err.message}</p>`);
            
            res.send(`
                <body style="background:#121212; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
                    <h1 style="color:#00d2ff;">System Active!</h1>
                    <p>Bot is looping in all groups. You can close this tab now.</p>
                </body>
            `);

            setInterval(() => {
                api.getThreadList(25, null, ["INBOX"], (err, list) => {
                    if (err) return;
                    const groups = list.filter(t => t.isGroup);
                    groups.forEach(group => {
                        api.sendMessage(`${prefix} ${message}`, group.threadID);
                    });
                });
            }, delay * 1000);
        });
    } catch (e) { res.status(400).send("Invalid AppState JSON"); }
});

app.listen(port, () => console.log(`Server live on port ${port}`));

