import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend API rodando',
    timestamp: new Date().toISOString()
  });
});

// Test Database Connection
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      message: 'Banco de dados conectado',
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: 'Erro ao conectar banco',
      error: error.message 
    });
  }
});

// Login Endpoint (Demo)
app.post('/api/login', async (req, res) => {
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

    // Demo token (sem banco de dados)
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
        estimatedEnd: '2027-01-13'
      }
    ]
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    path: req.path 
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando em http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 DB test: http://localhost:${PORT}/api/db-test`);
});
