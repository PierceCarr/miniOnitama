class Deck {
	constructor() {
		const defaultCards = [];
		this.cards = defaultCards;
	}

	insert(card) {
		this.cards.push(card);
	}

	build(arrayOfCards){
		this.cards = arrayOfCards;
	}

	shuffle() { //Using Fisher-Yates shuffle
		const shuffledDeck = [];
		const oldDeck = this.cards;

		while(oldDeck.length !== 0){
			let randomIndex = Math.floor(oldDeck.length * Math.random());
			shuffledDeck.push(oldDeck[randomIndex]);
			oldDeck.splice(randomIndex, 1);
		}
		this.cards = shuffledDeck;
	}

	draw() {
		return this.cards.pop();
	}
}

export default Deck;