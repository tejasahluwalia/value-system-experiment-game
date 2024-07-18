import express from 'express';
import path from 'path';
import { createUser } from './api/user.js';
import { addEvent } from './api/event.js';
import cookieParser from 'cookie-parser';

const app = express();
const port = 3030;

const __dirname = path.resolve();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

app.use('/round1i', express.static(path.join(__dirname, 'routes', 'round1i')));
app.use('/round2i', express.static(path.join(__dirname, 'routes', 'round2i')));
app.use('/round3i', express.static(path.join(__dirname, 'routes', 'round3i')));
app.use('/thank-you', express.static(path.join(__dirname, 'routes', 'thank-you')));
app.use('/round1', express.static(path.join(__dirname, 'routes', 'round1')));
app.use('/round2', express.static(path.join(__dirname, 'routes', 'round2')));
app.use('/round3', express.static(path.join(__dirname, 'routes', 'round3')));

app.post('/api/user', async (req, res) => {
  createUser(req, res);
});

app.put('/api/event', async (req, res) => {
  addEvent(req, res);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
