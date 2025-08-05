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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur http://localhost:${PORT}`));
