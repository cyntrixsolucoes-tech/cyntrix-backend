import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 3) return res.status(400).json({ error: 'Invalid' });
  res.json({ success: true, token: 'token-' + Date.now(), user: { email } });
});
app.get('/api/projects', (req, res) => res.json({ projects: [{ id: 1, name: 'São Luiz' }] }));
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on :${PORT}`));
