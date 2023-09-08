pragma solidity ^0.7.3;

contract PredictionMarket {

  // option that have different value
  enum Side { Argentina, France }
  struct Result {
    Side winner;
    Side loser;
  }
  Result result;
  bool electionFinished;

  // mapping  total amount of ether each candidate
  mapping(Side => uint) public bets;

  //which side gambler bet on and howw much
  mapping(address => mapping(Side => uint)) public betsPerGambler;
  address public oracle;

  constructor(address _oracle) {
    oracle = _oracle; 
  }

  // function to  place bets external payable because we pay in ether
  function placeBet(Side _side) external payable {
    require(electionFinished == false, 'election is finished');
    //here we have incremented as we placed the bets
    bets[_side] += msg.value;
    betsPerGambler[msg.sender][_side] += msg.value;
  }

  // we hav used this function instead of automatic payment because it will get really expensive and will need lot of gas at the same time
  function withdrawGain() external {
    uint gamblerBet = betsPerGambler[msg.sender][result.winner];
    require(gamblerBet > 0, 'you do not have any winning bet');  
    require(electionFinished == true, 'election not finished yet');
    uint gain = gamblerBet + bets[result.loser] * gamblerBet / bets[result.winner];
    betsPerGambler[msg.sender][Side.Argentina] = 0;
    betsPerGambler[msg.sender][Side.France] = 0;
    msg.sender.transfer(gain);
  }

  function reportResult(Side _winner, Side _loser) external {
    require(oracle == msg.sender, 'only oracle');
    result.winner = _winner;
    result.loser = _loser;
    electionFinished = true;
  }
}
