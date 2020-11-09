import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';

function App() {

  const [deck, setDeck] = useState("");
  const [dealer, setDealer] = useState([]);
  const [player, setPlayer] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [winner, setWinner] = useState("");

  let fetchDeck = async () => {
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1");
    res
      .json()
      .then(res => setDeck(res.deck_id))
  }

  let fetchCard = async (count) => {
    const res = await fetch("https://deckofcardsapi.com/api/deck/" + deck + "/draw/?count=" + count);
    return res.json()
  }

  let fetchDealer = async () => {
    const cards_response = await fetchCard(2)
    setDealer(cards_response.cards)
  }

  let fetchPlayer = async () => {
    const cards_response = await fetchCard(2)
    setPlayer(cards_response.cards)
  }

  let fetchPlayerCard = async () => {
    const cards_response = await fetchCard(1)
    setPlayer([...player, ...cards_response.cards]) 
  }

  let calculateScore = (user) => {

    let aces = 0
    let score = user.reduce((acc, card) => {
      let value = card.value
      console.log(value)
      if(isNaN(value)) {

        if(value === 'ACE') {
          aces += 1
          return acc
        } else {
          return acc + 10
        }
      } else {
        console.log("in ater ace",isNaN(value), value, acc)
        return acc + Number(value)
      }
    }, 0)
    console.log(score,"score")
    while(aces > 0) {
      aces--
      // if the score is less than 11, and there are more aces, add 1. 
      if(score < 11 ) {
        if(aces > 0) {
          score += 1  
        } else {
          score += 11  
        }
      } else {
        score += 1
      }
    }
    return score
    setPlayerScore(score)
  }

  let determineWinner = () => {
    if(playerScore > 21) {
      setWinner("Dealer")
    }
    if(playerScore > dealerScore) {
      setWinner("Player")
    } else {
      setWinner("Dealer")
    }
  }

  let reset = () => {
    setDeck("")
    setDealer([])
    setPlayer([])
    setWinner("")    
  }

  useEffect(() => {
    setPlayerScore(calculateScore(player))
    setDealerScore(calculateScore(dealer))
    if(deck === "") {
      fetchDeck()
    }

    if(dealer.length === 0) {

      fetchDealer()
    }

    if(player.length === 0) {
      fetchPlayer()
    }
  });  

  return (
    <div className="App">
      <header className="App-header">
        <div className="dealer">
          <img src={dealer[0]?.image} />
          <img src={dealer[1]?.image} />
        </div>
        Dealer Score:{dealerScore}  Player Score:{playerScore}
        {
          winner ?
          <div>Winner: {winner} </div>
          :
          <></>
        }
        
        <div className="player">
          {
            player.map((card)=> {
              return(<img src={card.image} />  )
            })
          }
        </div>

        <button onClick={fetchPlayerCard}>Hit</button>
        <button onClick={determineWinner}>Stand</button>
        <button onClick={reset}>Reset</button>
      </header>
    </div>
  );
}

export default App;
