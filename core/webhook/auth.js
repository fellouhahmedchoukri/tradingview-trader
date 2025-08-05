import CryptoJS from 'crypto-js';

export const authenticate = (req, res, next) => {
  const signature = req.headers['tv-signature'];
  if (!signature) {
    console.warn('Tentative d\'accès non authentifiée');
    return res.status(401).send('Signature manquante');
  }

  const payload = JSON.stringify(req.body);
  const secret = process.env.TRADINGVIEW_SECRET;
  const digest = CryptoJS.HmacSHA256(payload, secret).toString(CryptoJS.enc.Hex);

  if (signature !== digest) {
    console.warn(`Tentative d'accès non autorisé: ${req.ip}`);
    return res.status(403).send('Signature invalide');
  }

  next();
};
