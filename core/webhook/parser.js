// parser.js
const parsePayload = (payload) => {
  const requiredFields = ['symbol', 'action', 'price', 'strategy'];
  missingFields = requiredFields.filter(field => !payload[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
  }

  return {
    asset: payload.symbol.replace('PERP', '').replace('/', ''),
    type: payload.action.toUpperCase(),
    entryPrice: parseFloat(payload.price),
    strategy: payload.strategy,
    size: payload.size ? parseFloat(payload.size) : null,
    leverage: payload.leverage || 10
  };
};

module.exports = { parsePayload };