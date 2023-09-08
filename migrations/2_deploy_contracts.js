const PredictionMarket = artifacts.require('PredictionMarket');

const Side = {
  Argentina: 0,
  France: 1
};

module.exports = async function (deployer, _network, addresses) {
  const [admin, oracle, gambler1, gambler2, gambler3, gambler4, _] = addresses;
  await deployer.deploy(PredictionMarket, oracle);
  const predictionMarket = await PredictionMarket.deployed();
  await predictionMarket.placeBet(
    Side.Argentina, 
    {from: gambler1, value: web3.utils.toWei('1')}
  );
  await predictionMarket.placeBet(
    Side.Argentina, 
    {from: gambler2, value: web3.utils.toWei('1')}
  );
  await predictionMarket.placeBet(
    Side.Argentina, 
    {from: gambler3, value: web3.utils.toWei('2')}
  );
  await predictionMarket.placeBet(
    Side.France, 
    {from: gambler4, value: web3.utils.toWei('1')}
  );
};
