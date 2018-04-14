//TO DO: Figure out how to seperate Deck object into its own file
//and import it into this one.

// import React from 'react';
import Deck from './deck.js';

const EMPTY = 0, //empty space
      PIECE = 1, //theoretical piece
      MOVE = 2; //possible move

// class SpiritCard extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			engName: 'unnamed',
// 			hanzi: '@',
// 			moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
// 						EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
// 						EMPTY,EMPTY,PIECE,EMPTY,EMPTY,
// 						EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
// 						EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
// 		}
// 	}

// 	setCard(name, han, space){
// 		this.setState({engName: name});
// 		this.setState({hanzi: han});
// 		this.setState({moveSpace: space});
// 	}
// }

const allCards = []

const tiger = {
	engName: 'Tiger',
	hanzi: '虎',
	moveSpace: [EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,PIECE,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(tiger);

const crab = {
	engName: 'Crab',
	hanzi: '蟹',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				MOVE,EMPTY,PIECE,EMPTY,MOVE,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(crab);

const monkey = {
	engName: 'Monkey',
	hanzi: '猴',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,PIECE,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(monkey);

const crane = {
	engName: 'Crane',
	hanzi: '鹤',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,EMPTY,PIECE,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(crane);

const dragon = {
	engName: 'Dragon',
	hanzi: '龍',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				MOVE,EMPTY,EMPTY,EMPTY,MOVE,
				EMPTY,EMPTY,PIECE,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(dragon);

const elephant = {
	engName: 'Elephant',
	hanzi: '象',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,MOVE,EMPTY,
				EMPTY,MOVE,PIECE,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(elephant);

const mantis = {
	engName: 'Mantis',
	hanzi: '螂',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,PIECE,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(mantis);

const boar = {
	engName: 'Boar',
	hanzi: '豬',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,MOVE,PIECE,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(boar);

const frog = {
	engName: 'Frog',
	hanzi: '蛙',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,EMPTY,EMPTY,
				MOVE,EMPTY,PIECE,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(frog);

const goose = {
	engName: 'Goose',
	hanzi: '鵝',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,EMPTY,EMPTY,
				EMPTY,MOVE,PIECE,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(goose);

const horse = {
	engName: 'Horse',
	hanzi: '馬',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,MOVE,PIECE,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(horse);

const eel = {
	engName: 'Eel',
	hanzi: '鰻',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,MOVE,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,PIECE,MOVE,EMPTY,
				EMPTY,MOVE,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(eel);

const rabbit = {
	engName: 'Rabbit',
	hanzi: '兔',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,PIECE,EMPTY,MOVE,
				EMPTY,MOVE,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(rabbit);

const rooster = {
	engName: 'Rooster',
	hanzi: '雞',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,MOVE,EMPTY,
				EMPTY,MOVE,PIECE,MOVE,EMPTY,
				EMPTY,MOVE,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(rooster);

const ox = {
	engName: 'Ox',
	hanzi: '牛',
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,EMPTY,PIECE,MOVE,EMPTY,
				EMPTY,EMPTY,MOVE,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(ox);

const cobra = {
	engName: 'Cobra',
	hanzi: '鏡', //Maybe find a way to use 鏡蛇
	moveSpace: [EMPTY,EMPTY,EMPTY,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,MOVE,EMPTY,
				EMPTY,MOVE,PIECE,EMPTY,EMPTY,
				EMPTY,EMPTY,EMPTY,MOVE,EMPTY,
				EMPTY,EMPTY,EMPTY,EMPTY,EMPTY],
}

allCards.push(cobra);

const fullDeck = new Deck();
fullDeck.build(allCards);

export {fullDeck};