const express = require('express');
const { authenticate } = require('../core/webhook/auth');
const { parsePayload } = require('../core/webhook/parser');
const { executeStrategy } = require('../core/exchange/executeOrder');

const app = express();
app.use(express.json());

app.post('/webhook', authenticate, (req, res) => {
  try {
    const tradeSignal = parsePayload(req.body);
    executeStrategy(tradeSignal);
    res.status(200).send('Signal exécuté');
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    res.status(400).send('Traitement échoué');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur actif sur ${PORT}`));