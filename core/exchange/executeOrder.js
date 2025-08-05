import { connect as createExchangeConnection } from './connector.js';
import config from '../../config/exchanges.js';

const executeStrategy = async (signal) => {
  // Utilisation du nom modifié
  const exchange = createExchangeConnection(config.selectedExchange, config.exchanges[config.selectedExchange]);
  
  const orderParams = {
    symbol: `${signal.asset}/USDT:USDT`,
    type: 'MARKET',
    amount: signal.size || calculatePositionSize(signal.entryPrice),
    leverage: signal.leverage
  };

  try {
    if (signal.type === 'BUY') {
      return await exchange.createOrder(orderParams.symbol, orderParams.type, 'buy', orderParams.amount);
    } else if (signal.type === 'SELL') {
      return await exchange.createOrder(orderParams.symbol, orderParams.type, 'sell', orderParams.amount);
    } else if (signal.type === 'CLOSE') {
      const positions = await exchange.fetchPositions([orderParams.symbol]);
      if (positions.length > 0) {
        return await exchange.cancelAllOrders(orderParams.symbol);
      }
    }
  } catch (error) {
    console.error(`Erreur d'exécution: ${error.message}`);
    // Système de reprise
    await handleOrderError(error, orderParams);
  }
};

const calculatePositionSize = (entryPrice) => {
  const riskPercent = 0.02;
  return (config.accountBalance * riskPercent) / entryPrice;
};

const handleOrderError = async (error, orderParams) => {
  if (error instanceof ccxt.NetworkError) {
    console.log('Erreur réseau, nouvelle tentative...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return executeStrategy(orderParams);
  }
  // Gestion d'autres erreurs
};

export { executeStrategy };
