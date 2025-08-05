import { connect } from '../core/exchange/connector.js';
import config from '../config/exchanges.js';

(async () => {
  try {
    const exchange = connect(config.selectedExchange, config.exchanges[config.selectedExchange]);
    await exchange.loadMarkets();
    console.log(`✅ Connecté avec succès à ${config.selectedExchange}`);
    const balance = await exchange.fetchBalance();
    console.log(`💰 Solde: ${balance.USDT.free} USDT`);
  } catch (error) {
    console.error('Échec de la configuration:');
    console.error(error);
    process.exit(1);
  }
})();
