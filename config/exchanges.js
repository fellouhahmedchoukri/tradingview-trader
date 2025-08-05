export default {
  selectedExchange: 'binance',
  accountBalance: 1000, // Mise à jour automatique recommandée
  
  exchanges: {
    binance: {
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      futures: true,
      testnet: process.env.TESTNET === 'true' || false,
      options: {
        defaultType: 'future'
      }
    }
  }
};
