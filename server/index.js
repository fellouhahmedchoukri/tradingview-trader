import express from 'express';
import { authenticate } from '../core/webhook/auth.js';
import { parsePayload } from '../core/webhook/parser.js';
import { executeStrategy } from '../core/exchange/executeOrder.js';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.post('/webhook', authenticate, (req, res) => {
  try {
    const tradeSignal = parsePayload(req.body);
    executeStrategy(tradeSignal);
    res.status(200).send('Signal exécuté');
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    res.status(400).send(error.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Serveur actif sur ${PORT}`));
