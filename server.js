import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend API rodando',
    timestamp: new Date().toISOString()
  });
});

// Login Endpoint (Demo)
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email e senha são obrigatórios' 
      });
    }

    // Demo: accept any email + password 3+ chars
    if (password.length < 3) {
      return res.status(401).json({ 
        error: 'Senha deve ter no mínimo 3 caracteres' 
      });
    }

    // Demo token
    const token = 'demo-token-' + Date.now();
    
    res.json({
      success: true,
      token,
      user: {
        email,
        name: email.split('@')[0],
        role: 'client'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro ao fazer login',
      message: error.message 
    });
  }
});

// Get Projects (Demo)
app.get('/api/projects', (req, res) => {
  res.json({
    success: true,
    projects: [
      {
        id: 1,
        name: 'São Luiz - Consultoria Fiscal',
        status: 'Em andamento',
        progress: 35,
        startDate: '2026-07-13',
        estimatedEnd:
