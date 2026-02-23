const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.OPENCODE_SERVER_PASSWORD || 'vipvip';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/health', (req, res) => res.send('OK'));

app.post('/auth', (req, res) => {
  const { password } = req.body;
  if (password === PASSWORD) {
    res.json({ success: true, token: Buffer.from(password).toString('base64') });
  } else {
    res.status(401).json({ success: false, message: 'Invalid password' });
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token && Buffer.from(token, 'base64').toString() === PASSWORD) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  const ptyProcess = pty.spawn('/bin/bash', [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: process.env.HOME || '/root',
    env: { ...process.env, TERM: 'xterm-256color' }
  });

  ptyProcess.onData((data) => socket.emit('data', data));
  socket.on('data', (data) => ptyProcess.write(data));
  socket.on('resize', ({ cols, rows }) => ptyProcess.resize(cols, rows));
  socket.on('disconnect', () => ptyProcess.kill());
});

server.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
