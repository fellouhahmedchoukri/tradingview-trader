export const parsePayload = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload invalide');
  }

  // Binance utilise des symboles sans slash
  const binanceSymbol = payload.symbol.replace('/', '');
  
  return {
    asset: binanceSymbol,
    type: payload.action.toUpperCase(),
    entryPrice: parseFloat(payload.price),
    strategy: payload.strategy || 'default',
    size: payload.size ? parseFloat(payload.size) : null,
    leverage: payload.leverage || 10
  };
};
