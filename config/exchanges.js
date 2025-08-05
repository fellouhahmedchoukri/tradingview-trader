module.exports = {
  selectedExchange: 'bybit',
  accountBalance: 1000, // Mise à jour dynamique recommandée
  
  exchanges: {
    bybit: {
      apiKey: process.env.BYBIT_API_KEY,
      secret: process.env.BYBIT_API_SECRET,
      futures: true,
      options: { adjustForTimeDifference: true }
    },
    binance: {
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      futures: true
    }
  }
};