const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// serve overlay
app.use(express.static(path.join(__dirname, "public")));

const server = app.listen(process.env.PORT || 3000, () =>
  console.log("Server running")
);

const wss = new WebSocket.Server({ server });

let clients = [];

wss.on("connection", (ws) => {
  clients.push(ws);

  ws.on("close", () => {
    clients = clients.filter(c => c !== ws);
  });
});

// donation endpoint
app.post("/donate", (req, res) => {
  const { name, amount } = req.body;

  const seconds = amount * 2;

  const payload = { name, amount, seconds };

  clients.forEach(client => {
    client.send(JSON.stringify(payload));
  });

  res.json({ success: true });
});