const login = require("fca-smart-shankar");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Professional Dashboard
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="hi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Elite Messenger Control</title>
        <style>
            :root { --primary: #00d2ff; --secondary: #3a7bd5; --dark: #121212; --card: #1e1e1e; }
            body { font-family: 'Segoe UI', sans-serif; background: var(--dark); color: white; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
            .container { background: var(--card); padding: 30px; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 100%; max-width: 450px; border: 1px solid #333; }
            h2 { text-align: center; background: linear-gradient(to right, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 26px; margin-bottom: 20px; }
            label { font-size: 13px; color: #aaa; margin-top: 12px; display: block; }
            input, textarea { width: 100%; background: #2a2a2a; border: 1px solid #444; padding: 12px; border-radius: 10px; color: white; margin-top: 5px; box-sizing: border-box; }
            input:focus, textarea:focus { border-color: var(--primary); outline: none; }
            button { width: 100%; padding: 15px; margin-top: 25px; background: linear-gradient(to right, var(--primary), var(--secondary)); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold; text-transform: uppercase; }
            .footer { text-align: center; margin-top: 20px; font-size: 11px; color: #444; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>System Control</h2>
            <form action="/start" method="POST">
                <label>Account AppState (JSON)</label>
                <textarea name="appstate" rows="4" placeholder="Paste AppState here..." required></textarea>
                
                <label>Target Group UID</label>
                <input type="text" name="targetUID" placeholder="Enter Specific Group ID" required>

                <label>Target Name / Prefix</label>
                <input type="text" name="prefix" placeholder="Example: Hey Alex," required>
                
                <label>Loop Message</label>
                <textarea name="message" rows="2" placeholder="Your message..." required></textarea>
                
                <label>Speed (Seconds)</label>
                <input type="number" name="delay" value="15" required>
                
                <button type="submit">Execute Attack</button>
            </form>
            <div class="footer">POWERED BY GEMINI AI CORE</div>
        </div>
    </body>
    </html>
    `);
});

app.post('/start', (req, res) => {
    const { appstate, targetUID, prefix, message, delay } = req.body;
    try {
        const state = JSON.parse(appstate);
        login({ appState: state }, (err, api) => {
            if (err) return res.send(`<h2>Login Failed</h2><p>${err.message}</p>`);
            
            res.send(`
                <body style="background:#121212; color:white; font-family:sans-serif; text-align:center; padding-top:100px;">
                    <h1 style="color:#00d2ff;">Target Locked!</h1>
                    <p>Shankar Bot is hitting Group ID: <b>${targetUID}</b></p>
                    <br><a href="/" style="color:#aaa; text-decoration:none;">Go Back</a>
                </body>
            `);

            // Infinite loop for specific group
            setInterval(() => {
                const finalMsg = `${prefix} ${message}`;
                api.sendMessage(finalMsg, targetUID.trim(), (sendErr) => {
                    if (sendErr) console.error("Error:", sendErr);
                    else console.log(`[Shankar] Sent to: ${targetUID}`);
                });
            }, delay * 1000);
        });
    } catch (e) { res.status(400).send("Invalid AppState JSON"); }
});

app.listen(port, () => console.log(`Shankar system live on port ${port}`));
