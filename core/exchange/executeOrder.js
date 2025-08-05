import { connect as createExchangeConnection } from './connector.js';
import config from '../../config/exchanges.js';

const executeStrategy = async (signal) => {
  const exchange = createExchangeConnection(
    config.selectedExchange, 
    config.exchanges[config.selectedExchange]
  );
  
  // Format du symbol pour Binance
  const binanceSymbol = `${signal.asset}USDT`;
  
  const orderParams = {
    symbol: binanceSymbol,
    type: 'MARKET',
    amount: signal.size || calculatePositionSize(signal.entryPrice),
    leverage: signal.leverage
  };

  try {
    console.log(`Signal reçu: ${signal.type} ${orderParams.symbol} à ${signal.entryPrice}`);
    
    if (signal.type === 'BUY') {
      const order = await exchange.createOrder(
        binanceSymbol,
        'market',
        'buy',
        orderParams.amount
      );
      console.log('Ordre BUY exécuté:', order);
      return order;
      
    } else if (signal.type === 'SELL') {
      const order = await exchange.createOrder(
        binanceSymbol,
        'market',
        'sell',
        orderParams.amount
      );
      console.log('Ordre SELL exécuté:', order);
      return order;
      
    } else if (signal.type === 'CLOSE') {
      console.log('Fermeture des positions pour', binanceSymbol);
      await exchange.cancelAllOrders(binanceSymbol);
      const positions = await exchange.fetchPositions([binanceSymbol]);
      
      if (positions.length > 0) {
        const closeOrder = await exchange.createOrder(
          binanceSymbol,
          'market',
          positions[0].side === 'long' ? 'sell' : 'buy',
          positions[0].contracts
        );
        console.log('Position fermée:', closeOrder);
        return closeOrder;
      }
    }
  } catch (error) {
    console.error(`Erreur d'exécution: ${error.message}`);
    // Réessayer après 2s en cas d'erreur réseau
    if (error.name.includes('NetworkError')) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return executeStrategy(signal);
    }
  }
};

const calculatePositionSize = (entryPrice) => {
  const riskPercent = 0.02; // 2% du capital
  return (config.accountBalance * riskPercent) / entryPrice;
};

export { executeStrategy };
