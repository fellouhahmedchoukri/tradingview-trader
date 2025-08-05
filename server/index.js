import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from '../core/webhook/auth.js';
import { parsePayload } from '../core/webhook/parser.js';
import { executeStrategy } from '../core/exchange/executeOrder.js';
import dotenv from 'dotenv';

// Configuration des chemins pour ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();
app.use(express.json());

// Configuration du moteur de template (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'dashboard', 'views'));

// Fichiers statiques pour le dashboard
app.use('/dashboard', express.static(path.join(__dirname, 'dashboard', 'public')));
app.use('/assets', express.static(path.join(__dirname, 'dashboard', 'public')));

// Middleware de journalisation
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Route du dashboard
app.get('/dashboard', (req, res) => {
  // Exemple de données (à remplacer par vos données réelles)
  const dashboardData = {
    accountBalance: 12500.75,
    activeTrades: [
      { symbol: 'BTCUSDT', side: 'buy', amount: 0.05, entryPrice: 62000, currentPrice: 63500, profit: 750 },
      { symbol: 'ETHUSDT', side: 'sell', amount: 1.2, entryPrice: 3500, currentPrice: 3400, profit: 120 }
    ],
    strategies: [
      { name: 'RSI Divergence', active: true, profitability: 15.7 },
      { name: 'MA Crossover', active: true, profitability: 8.2 }
    ],
    activities: [
      { icon: 'fas fa-bolt', message: 'Signal BUY exécuté pour BTCUSDT', timestamp: '2025-08-05 21:05:12' },
      { icon: 'fas fa-chart-line', message: 'Nouveau plus haut du portefeuille', timestamp: '2025-08-05 20:45:33' }
    ]
  };
  
  res.render('dashboard', dashboardData);
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

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.get('/', (req, res) => {
  res.send(`
    <h1>TradingBot Pro</h1>
    <p>Serveur opérationnel</p>
    <ul>
      <li>Webhook: <code>POST /webhook</code></li>
      <li>Health Check: <a href="/health">/health</a></li>
      <li>Dashboard: <a href="/dashboard">/dashboard</a></li>
    </ul>
  `);
});

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
