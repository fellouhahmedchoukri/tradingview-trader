import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configuration des chemins pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());

// Configuration des fichiers statiques
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard', 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware de journalisation
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Route du dashboard - version statique
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard', 'public', 'dashboard.html'));
});

// Webhook TradingView (exemple simplifié)
app.post('/webhook', (req, res) => {
  try {
    console.log('Signal reçu:', req.body);
    res.status(200).json({ status: 'success', message: 'Signal reçu' });
  } catch (error) {
    console.error(`Erreur webhook: ${error.message}`);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Health Check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Route principale
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>TradingBot Pro</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background: #0f172a;
          color: #f1f5f9;
        }
        h1 { color: #2962ff; }
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 30px;
          background: #1e293b;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        }
        a { 
          display: inline-block; 
          margin: 20px; 
          padding: 15px 30px; 
          background: #2962ff; 
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          font-size: 18px;
          font-weight: 500;
          transition: all 0.3s;
        }
        a:hover {
          background: #1a53ff;
          transform: translateY(-3px);
        }
        .status {
          margin: 30px 0;
          padding: 15px;
          background: rgba(41, 98, 255, 0.1);
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #00c853;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>TradingBot Pro - Opérationnel</h1>
        <p>Serveur fonctionnel et prêt à recevoir des signaux TradingView</p>
        
        <div class="status">
          <span class="status-dot"></span>
          <span>Connecté à Binance</span>
        </div>
        
        <div>
          <a href="/dashboard">Accéder au Dashboard</a>
          <a href="/health">Health Check</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur actif sur: ${HOST}:${PORT}`);
  console.log(`🌐 URL publique: ${PUBLIC_URL}`);
  console.log(`✅ Health Check: ${PUBLIC_URL}/health`);
  console.log(`🔔 Webhook TradingView: ${PUBLIC_URL}/webhook`);
  console.log(`📊 Dashboard: ${PUBLIC_URL}/dashboard`);
});
