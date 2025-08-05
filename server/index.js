import express from 'express';
import { authenticate } from '../core/webhook/auth.js';
import { parsePayload } from '../core/webhook/parser.js';
import { executeStrategy } from '../core/exchange/executeOrder.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

// Middleware de journalisation
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.post('/webhook', authenticate, async (req, res) => {
  try {
    const tradeSignal = parsePayload(req.body);
    await executeStrategy(tradeSignal);
    res.status(200).json({ status: 'success', message: 'Signal exécuté' });
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    res.status(400).json({ status: 'error', message: error.message });
  }
});

// Route de santé
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Route principale pour vérification
app.get('/', (req, res) => {
  res.send(`
    <h1>TradingBot Pro</h1>
    <p>Serveur opérationnel</p>
    <ul>
      <li>Webhook: <code>POST /webhook</code></li>
      <li>Health Check: <a href="/health">/health</a></li>
    </ul>
  `);
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';  // Écoute sur toutes les interfaces
const PUBLIC_URL = process.env.PUBLIC_URL || `http://localhost:${PORT}`;

app.listen(PORT, HOST, () => {
  console.log(`🚀 Serveur actif sur: ${HOST}:${PORT}`);
  console.log(`🌐 URL publique: ${PUBLIC_URL}`);
  console.log(`✅ Health Check: ${PUBLIC_URL}/health`);
  console.log(`🔔 Webhook TradingView: ${PUBLIC_URL}/webhook`);
});
