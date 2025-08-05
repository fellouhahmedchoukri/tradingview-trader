import ccxt from 'ccxt';

export const connect = (exchangeId, config) => {
  const exchangeClass = ccxt[exchangeId];
  if (!exchangeClass) throw new Error(`Exchange non supporté: ${exchangeId}`);
  
  const exchange = new exchangeClass({
    apiKey: config.apiKey,
    secret: config.secret,
    options: { adjustForTimeDifference: true }
  });
  
  exchange.setSandboxMode(false);
  return exchange;
};
