import React, { Component } from "react";
import axios from "axios";
import Card from './Card';
import './Deck.css'

const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deck: null,
      cardsTable: []
    };
    this.getCard = this.getCard.bind(this);
  }

  //On recupère un jeu de cartes (deck)
  async componentDidMount() {
    const deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
    this.setState({
      deck: deck.data,
    });
  }

  //On recupere une carte à partir de ce jeu
  async getCard() {
    let id = this.state.deck.deck_id;
    try{
        let cardUrl = `${API_BASE_URL}/${id}/draw/`;
        let cardResponse = await axios.get(cardUrl);
        //S'il n'y a plus de carte dans le jeu de cartes
        if(!cardResponse.data.success){
            throw new Error ("No card remaining");
        }
        let card = cardResponse.data.cards[0];
        this.setState(st =>({
            cardsTable: [...st.cardsTable, 
                {
                    id: card.code,
                    image: card.image,
                    name: `${card.value} of ${card.suit}`
                }
            ]
        }))
    } catch (err) {
        alert(err)
    }
  }

  render() {
      const cards = this.state.cardsTable.map(card => (
          <Card key={card.id} image={card.image} name={card.name} />
      ))
    return (
      <div>
        <h1 className="Deck-title">♦ Card dealer ♦</h1>
        <button className="Deck-btn" onClick={this.getCard}> Get card </button>
        <div className="Deck-cardarea">
            {cards}
        </div>
      </div>
    );
  }
}

export default Deck;
