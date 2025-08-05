import ccxt from 'ccxt';

export const connect = (exchangeId, config) => {
  if (!ccxt[exchangeId]) {
    throw new Error(`Exchange non supporté: ${exchangeId}`);
  }
  
  const exchange = new ccxt[exchangeId]({
    apiKey: config.apiKey,
    secret: config.secret,
    enableRateLimit: true,
    options: {
      defaultType: 'future',
      adjustForTimeDifference: true
    }
  });
  
  if (config.testnet) {
    exchange.setSandboxMode(true);
  }
  
  return exchange;
};
