import CryptoJS from 'crypto-js';

export const authenticate = (req, res, next) => {
  const signature = req.headers['tv-signature'];
  if (!signature) return res.status(401).send('Signature manquante');

  const payload = JSON.stringify(req.body);
  const secret = process.env.TRADINGVIEW_SECRET;
  const hmac = CryptoJS.HmacSHA256(payload + Date.now(), secret);
  const digest = CryptoJS.enc.Hex.stringify(hmac);

  if (signature !== digest) {
    console.warn(`Tentative d'accès non autorisé: ${req.ip}`);
    return res.status(403).send('Signature invalide');
  }

  next();
};
