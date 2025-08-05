export const parsePayload = (payload) => {
  // Validation améliorée
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload invalide');
  }

  const requiredFields = ['symbol', 'action', 'price'];
  const missingFields = requiredFields.filter(field => !(field in payload));
  
  if (missingFields.length > 0) {
    throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
  }

  return {
    asset: payload.symbol.replace('PERP', '').replace('/', ''),
    type: payload.action.toUpperCase(),
    entryPrice: parseFloat(payload.price),
    strategy: payload.strategy || 'default',
    size: payload.size ? parseFloat(payload.size) : null,
    leverage: payload.leverage || 10
  };
};
