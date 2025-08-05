import { connect } from '../core/exchange/connector.js';
import config from '../config/exchanges.js';

(async () => {
  try {
    const exchange = connect(config.selectedExchange, config.exchanges[config.selectedExchange]);
    await exchange.loadMarkets();
    console.log(`✅ Connecté avec succès à ${config.selectedExchange}`);
    console.log(`💰 Solde: ${(await exchange.fetchBalance()).USDT.free} USDT`);
  } catch (error) {
    console.error('Échec de la configuration:');
    console.error(error.message);
    process.exit(1);
  }
})();
