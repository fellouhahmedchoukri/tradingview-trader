export default {
  selectedExchange: 'binance',
  accountBalance: 1000,
  
  exchanges: {
    bybit: {
      apiKey: process.env.BINANCE_API_KEY,
      secret: process.env.BINANCE_API_SECRET,
      futures: true,
      options: { adjustForTimeDifference: true }
    }
  }
};
