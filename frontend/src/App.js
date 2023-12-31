import React, { useState, useEffect } from 'react';
import getBlockchain from './ethereum.js';
import { Pie } from 'react-chartjs-2';

const SIDE = {
  ARGENTINA: 0,
  FRANCE: 1
};

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [predictionMarket, setPredictionMarket] = useState(undefined);
  const [betPredictions, setBetPredictions] = useState(undefined);
  const [myBets, setMyBets] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const { signerAddress, predictionMarket } = await getBlockchain();
      const bets = await Promise.all([
        predictionMarket.bets(SIDE.ARGENTINA),
        predictionMarket.bets(SIDE.FRANCE)
      ]);
      const betPredictions = {
      	labels: [
      		'France',
      		'Argentina',
      	],
      	datasets: [{
      		data: [bets[1].toString(), bets[0].toString()],
      		backgroundColor: [
            '#FF6384',
            '#36A2EB',
      		],
      		hoverBackgroundColor: [
            '#FF6384',
            '#36A2EB',
      		]
      	}]
      };
      const myBets = await Promise.all([
        predictionMarket.betsPerGambler(signerAddress, SIDE.FRANCE),
        predictionMarket.betsPerGambler(signerAddress, SIDE.ARGENTINA),
      ]);
      setMyBets(myBets);
      //console.log(myBets[0].toString());
      setBetPredictions(betPredictions);
      setPredictionMarket(predictionMarket);
    };
    init();
  }, []);

  if(
    typeof predictionMarket === 'undefined'
    || typeof betPredictions === 'undefined'
    || typeof myBets === 'undefined'
  ) {
    return 'Loading...';
  }

  const placeBet = async (side, e) => {
    e.preventDefault();
    await predictionMarket.placeBet(
      side, 
      {value: e.target.elements[0].value}
    );
  };

  const withdrawGain = async () => {
    await predictionMarket.withdrawGain();
  };

  return (
    <div className='container'>

      <div className='row'>
        <div className='col-sm-12'>
          <h1 className='text-center'>Prediction Market</h1>
          <div className="jumbotron">
            <h1 className="display-4 text-center">Who will win the US election?</h1>
            <p className="lead text-center">Current odds</p>
            <div>
               <Pie data={betPredictions} />
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <div className='col-sm-6'>
          <div className="card">
            <img src='./img/mbappe_france.png' />
            <div className="card-body">
              <h5 className="card-title">France</h5>
              <form className="form-inline" onSubmit={e => placeBet(SIDE.France, e)}>
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Bet amount (ether)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className='col-sm-6'>
          <div className="card">
            <img src='./img/messi_arg.png' />
            <div className="card-body">
              <h5 className="card-title">Argentina</h5>
              <form className="form-inline">
                <input 
                  type="text" 
                  className="form-control mb-2 mr-sm-2" 
                  placeholder="Bet amount (ether)"
                />
                <button 
                  type="submit" 
                  className="btn btn-primary mb-2"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className='row'>
        <h2>Your bets</h2>
        <ul>
          <li>Argentina: {myBets[0].toString()} ETH (wei)</li>
          <li>France: {myBets[1].toString()} ETH (wei)</li>
        </ul>
      </div>

    <div className='row'>
      <h2>Claim your gains, if any, after the election</h2>
      <button 
        type="submit" 
        className="btn btn-primary mb-2"
        onClick={e => withdrawGain()}
      >
        Submit
      </button>
    </div>
  </div>
  );
}

export default App;
