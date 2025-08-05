import { connect } from './connector.js';
import config from '../../config/exchanges.js';

// ... (le reste du code inchangé)

export { executeStrategy };

const { connect } = require('./connector');
const config = require('../../config/exchanges');

const executeStrategy = async (signal) => {
  const exchange = connect(config.selectedExchange);
  
  const orderParams = {
    symbol: `${signal.asset}/USDT:USDT`,
    type: 'MARKET',
    amount: signal.size || calculatePositionSize(signal.entryPrice),
    leverage: signal.leverage
  };

  try {
    if (signal.type === 'BUY') {
      return await exchange.createLongOrder(orderParams);
    } else if (signal.type === 'SELL') {
      return await exchange.createShortOrder(orderParams);
    } else if (signal.type === 'CLOSE') {
      return await exchange.closePosition(orderParams.symbol);
    }
  } catch (error) {
    console.error(`Erreur d'exécution: ${error.message}`);
    // Système de reprise ici
  }
};

// Calcul automatique de la taille de position
const calculatePositionSize = (entryPrice) => {
  const riskPercent = 0.02; // 2% du capital
  const accountBalance = config.accountBalance;
  return (accountBalance * riskPercent) / entryPrice;
};


module.exports = { executeStrategy };
