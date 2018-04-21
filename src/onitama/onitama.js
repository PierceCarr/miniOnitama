import React from 'react';
import PropTypes from 'prop-types';
import {fullDeck} from './spiritDeck.js';
import Board from './board.js';
import SpiritCard from './spiritCard.js';
import MiniSquare from './minisquare.js';
import {HotKeys} from 'react-hotkeys';
import timer from 'react-timer-hoc';
import img_arrowLeft from './images/arrowLeft.png';
import img_arrowRight from './images/arrowRight.png';
import './onitama.css';

class Game extends React.Component {
	constructor(props) {
		super(props);

		const SPACES_ON_BOARD = 25,
		      STARTING_HIGHLIGHTED_STATE = false,
		      NOTHING_HIGHLIGHTED = Array(SPACES_ON_BOARD).fill(STARTING_HIGHLIGHTED_STATE), //find a way to not us Array() call
		      CARDS_PER_GAME = 5;

    this.blueTime = [this.props.turnMinutes, this.props.turnSeconds];
    this.focusElement = null;
    this.highlightedSpaces = NOTHING_HIGHLIGHTED;
    this.isFirstTurn = true;
		this.isGameOver = false;
		this.keyboardState = null;
		this.keyCount = -1; //Cycles between 0 and 999
		this.keyElement = Array(CARDS_PER_GAME).fill(null);
		this.neutralToRotate = null;
		this.outOfTimeTime = null;
		this.pieceType = {
			EMPTY_SPACE: 0,
			BLUE_PUPPET: 1,
			BLUE_ONMYO: 2,
			RED_PUPPET: 3,
			RED_ONMYO: 4
		}
		this.redTime = [this.props.turnMinutes, this.props.turnSeconds];
		this.switchTurns = this.switchTurns.bind(this);
		this.turnTimerBlue = null;
		this.turnTimerRed = null;

		//Using these to make state.pieces more readable
		const EMPTY_SPACE = this.pieceType.EMPTY_SPACE,
		      BLUE_PUPPET = this.pieceType.BLUE_PUPPET,
		      BLUE_ONMYO = this.pieceType.BLUE_ONMYO,
		      RED_PUPPET = this.pieceType.RED_PUPPET,
		      RED_ONMYO = this.pieceType.RED_ONMYO;

		this.state = {
			elementToFocus: null,
			highlightedSpacesToRender: NOTHING_HIGHLIGHTED,
			isBlueUsingKeyboard: this.props.isBlueUsingKeyboard,
			isBlueTurn: this.randomizeFirstTurn(),
			isRedUsingKeyboard: this.props.isRedUsingKeyboard,
			keyboardTargetSpace: null,
			keyboardTargetSpirit: null,
			mouseSquare: null,
			pieces: [
				BLUE_PUPPET,EMPTY_SPACE,EMPTY_SPACE,EMPTY_SPACE,RED_PUPPET,
				BLUE_PUPPET,EMPTY_SPACE,EMPTY_SPACE,EMPTY_SPACE,RED_PUPPET,
				BLUE_ONMYO,EMPTY_SPACE,EMPTY_SPACE,EMPTY_SPACE,RED_ONMYO,
				BLUE_PUPPET,EMPTY_SPACE,EMPTY_SPACE,EMPTY_SPACE,RED_PUPPET,
				BLUE_PUPPET,EMPTY_SPACE,EMPTY_SPACE,EMPTY_SPACE,RED_PUPPET
			],
			selectedSpace: null,
			selectedSpirit: null,
			spiritCards: this.drawFive()
		};
	}

	//Lifecycle functions:
	componentDidMount() {
		const CARD_SELECT_STATE = 0;
		this.playArea.focus();

		if(this.state.isBlueUsingKeyboard && this.state.isBlueTurn){
			console.log("Set up card select state");
			this.keyboardState = CARD_SELECT_STATE;
		} else if (this.state.isRedUsingKeyboard && !this.state.isBlueTurn){
			console.log("Set up card select state");
			this.keyboardState = CARD_SELECT_STATE;
		}	
	}

	componentWillMount() {
		if(this.props.areTurnTimersInUse){
			const DECIMAL_RADIX = 10,
			      MINUTES_SLOT = 0,
			      SECONDS_SLOT = 1;
			if(this.state.isBlueTurn) { //if blue turn
				this.turnTimerBlue = 
					this.countDown(
						parseInt(this.blueTime[MINUTES_SLOT], DECIMAL_RADIX), 
					  parseInt(this.blueTime[SECONDS_SLOT], DECIMAL_RADIX), 
				 	  this.state.isBlueTurn); 
				this.turnTimerRed = "";

			} else { //if red turn
				this.turnTimerblue = "";
				this.turnTimerRed = 
					this.countDown(
						parseInt(this.redTime[MINUTES_SLOT], DECIMAL_RADIX), 
			      parseInt(this.redTime[SECONDS_SLOT], DECIMAL_RADIX), 
		 	      this.state.isBlueTurn);
			}
		} else { //Turn timers are not used
			this.turnTimerblue = "";
			this.turnTimerRed = "";
		}
	}

	//General functions:
	addToHighlightList(newSpace){
		let listToUpdate = this.highlightedSpaces;
		if(listToUpdate[newSpace] === false){
			listToUpdate[newSpace] = true;
			this.highlightedSpaces = listToUpdate;
		}
	}

	areThereLegalMovesRemaining(isBlueTurn){
		let legalMovesRemaining = false;
		const blueTurn = isBlueTurn === true,
		      piecesToCheck = [];

		const FIRST_SPACE = 0,
		      SPACES_ON_BOARD = 25;
		for(let i = FIRST_SPACE; i < SPACES_ON_BOARD; i++){
			if(blueTurn){
				const isBluePiece = this.state.pieces[i] === this.pieceType.BLUE_PUPPET || 
														this.state.pieces[i] === this.pieceType.BLUE_ONMYO;

				if(isBluePiece) piecesToCheck.push(i);
				// console.log("Blues found at: " + piecesToCheck);
			} else {
				const isRedPiece = this.state.pieces[i] === this.pieceType.RED_PUPPET || 
													 this.state.pieces[i] === this.pieceType.RED_ONMYO;
				if(isRedPiece) piecesToCheck.push(i);
			}
		}

		//For each piece find possible moves for each card 
		//For each possible move check legality
		//If one move is possible return true

		let cardOne, cardTwo;
		if(blueTurn){
			cardOne = 0;
			cardTwo = 1;
		} else {
			cardOne = 3;
			cardTwo = 4;
		}

		for(let i = 0; i < piecesToCheck.length; i++){

			for(let card = cardOne; card <= cardTwo; card++){

				const moves = this.state.spiritCards[card].moveSpace,
				      movesInPerspective = this.movesInPerspective(blueTurn, moves);
				for(let move = 0; move < movesInPerspective.length; move++){
					const THEORETICAL_MOVE = 2;
					let targetMove = null;
					if(movesInPerspective[move] === THEORETICAL_MOVE){
						targetMove = move;
					}
					if(targetMove !== null){

						const translatedMove = this.translateMove(targetMove, piecesToCheck[i]),
						      moveOnBoard = this.state.pieces[translatedMove];
						let legalMove;
						if(blueTurn){
							legalMove = moveOnBoard === this.pieceType.EMPTY_SPACE ||
													moveOnBoard === this.pieceType.RED_PUPPET ||
													moveOnBoard === this.pieceType.RED_ONMYO;
						  if(legalMove){
						  	legalMovesRemaining = true;
						  	return legalMovesRemaining;
						  }
						} else {
							legalMove = moveOnBoard === this.pieceType.EMPTY_SPACE ||
													moveOnBoard === this.pieceType.BLUE_PUPPET ||
													moveOnBoard === this.pieceType.BLUE_ONMYO;
							if(legalMove){
								legalMovesRemaining = true;
						  	return legalMovesRemaining;
							}
						}
					}
				}
			}
		}
		return legalMovesRemaining;
	}

	countDown(minutes, seconds, isBlue) {
			// minutes = minutes / 10; //this is obviously a problem
			if(this.props.areTurnTimersInUse) {
			const TheGame = this;

			const LAST_MINUTE = 1;

			if(this.props.isThereMinTurnTime && (minutes < LAST_MINUTE)) {
				if(seconds < this.props.minTurnTime) {
					seconds = this.props.minTurnTime;
				}
			}

			function TurnTimer({timer}) {
				const SECONDS_IN_A_MINUTE = 60;
				
				const totalSeconds = minutes * SECONDS_IN_A_MINUTE + seconds,
				      remainingTotalSeconds = totalSeconds - timer.tick;

				let remainingMinutes = Math.floor(remainingTotalSeconds / SECONDS_IN_A_MINUTE),
				    remainingSeconds = remainingTotalSeconds % SECONDS_IN_A_MINUTE;

				const LAST_TWO_DIGIT_NUMBER = 10;
				if(remainingMinutes < 0 && remainingSeconds < 0) {
					remainingMinutes = 0;
					remainingSeconds = '00';
				} else if (remainingSeconds < LAST_TWO_DIGIT_NUMBER) {
					remainingSeconds = '0' + remainingSeconds;
				}

				if(isBlue) {
					TheGame.blueTime = [remainingMinutes, remainingSeconds];
				} else {
					TheGame.redTime = [remainingMinutes, remainingSeconds];
				}

				return <div className="timer">
							 {remainingMinutes + ":" + remainingSeconds}</div>;
			}

			const MILISECONDS_IN_A_SECOND = 1000;
			return timer(MILISECONDS_IN_A_SECOND)(TurnTimer);
		} else {
			return "";
		}
	}

	checkForGameOver() {
		const BLUE_SHRINE_SPACE = 10,
		      RED_SHRINE_SPACE = 14;

		const blueShrineVictory = this.state.pieces[RED_SHRINE_SPACE] === this.pieceType.BLUE_ONMYO,
		      redShrineVictory = this.state.pieces[BLUE_SHRINE_SPACE] === this.pieceType.RED_ONMYO;

		if(blueShrineVictory){
			this.isGameOver = true;
			return "Blue Player Wins!";
		}

		if(redShrineVictory){
			this.isGameOver = true;
			return "Red Player Wins!";
		}

		let blueOnmyoDefeated = true,
		    redOnmyoDefeated = true;

		//Scan board spaces to see if Onmyos are present
		for(let i = 0; i < this.state.pieces.length; i++){
			if(this.state.pieces[i] === this.pieceType.BLUE_ONMYO){
				blueOnmyoDefeated = false;
			} else if (this.state.pieces[i] === this.pieceType.RED_ONMYO) {
				redOnmyoDefeated = false;
			}
		}

		if(blueOnmyoDefeated){
			this.isGameOver = true;
			return "Red Player Wins!";
		}

		if(redOnmyoDefeated){
			this.isGameOver = true;
			return "Blue Player Wins!";
		}

		const DECIMAL_RADIX = 10;
		const blueOutOfTime = (parseInt(this.blueTime[0], DECIMAL_RADIX) <= 0) && 
														 (parseInt(this.blueTime[1], DECIMAL_RADIX) <= 0);
		if(blueOutOfTime) {
			this.isGameOver = true;
			return "Blue out of time! Red Player Wins!";
		}

		const redOutOfTime = (parseInt(this.redTime[0], DECIMAL_RADIX) <= 0) && 
														(parseInt(this.redTime[1], DECIMAL_RADIX) <= 0);
		if(redOutOfTime) {
			this.isGameOver = true;
			return "Red out of time! Blue Player Wins!";
		}

		return null;

	}

	drawFive() {
		const CARDS_PER_GAME = 5;
		const gameCards = [];

		fullDeck.shuffle();
		for(let i = 0; i < CARDS_PER_GAME; i++){
			gameCards.push(fullDeck.cards[i]);
		}

		return gameCards;
	}

	formatSeconds() {
		const LAST_TWO_DIGIT_NUMBER = 10,
		      TWO_DIGITS = 1,
		      SECONDS_SLOT = 1;

		let seconds;
		if(this.state.isBlueTurn) {
			seconds = this.redTime[SECONDS_SLOT];
			if(seconds < LAST_TWO_DIGIT_NUMBER && !(seconds.length > TWO_DIGITS)){
				this.redTime[SECONDS_SLOT] = '0' + this.redTime[SECONDS_SLOT];
			}
		} else {
			seconds = this.blueTime[SECONDS_SLOT];
			if(seconds < LAST_TWO_DIGIT_NUMBER && !(seconds.length > TWO_DIGITS)){
				this.blueTime[SECONDS_SLOT] = '0' + this.blueTime[SECONDS_SLOT];
			}
		}
	}

	generateKey() {
		const MAXIMUM_KEY_SIZE = 999;
		// console.log("keycount: " + this.keyCount);
		this.keyCount++;
		if(this.keyCount > MAXIMUM_KEY_SIZE) this.keyCount = 0;
		return this.keyCount;
	}

	getMoves(targetCard) {
		if(targetCard === undefined){
			const cardSelected = this.state.selectedSpirit;
			if(cardSelected !== null){
				const cardData = this.state.spiritCards[cardSelected];
				return cardData.moveSpace;
			} else {
				return null;
			}
		} else {
			return this.state.spiritCards[targetCard].moveSpace;
		}
	}

	handleCardClick(i, selectedCard) {
		// console.log('Card clicked: ' + i);
		const unselected = (i === selectedCard);

		const BLUE_CARD_ONE = 0,
		      BLUE_CARD_TWO = 1,
		      RED_CARD_ONE = 3,
		      RED_CARD_TWO = 4;

		const clickedBlueCard = (i === BLUE_CARD_ONE) || 
														(i === BLUE_CARD_TWO);

		const clickedRedCard = (i === RED_CARD_ONE) ||
													 (i === RED_CARD_TWO);

	  const gameOver = (this.isGameOver === true);
	  // console.log('Game over is: ' + gameOver);
	  if(gameOver){
	  	return;
	  }

	  const cardIsClickable = (this.state.isBlueTurn && clickedBlueCard) ||
	                          (!this.state.isBlueTurn && clickedRedCard);

		if(unselected){
			this.setState({selectedSpirit: null}, () => this.makeNoSpacesHighlighted());
		} else { //Selected
			if(cardIsClickable){
				//If player has already selected a piece, make sure to show
				//the possible moves of the new card immediately
				if(this.state.selectedPiece !== null){
					this.setState({selectedSpirit: i}, () => this.highlightMoves());
				} else {
					this.setState({selectedSpirit: i});
				}
			} 
		}
	}

	handleKeyInput(event) {
		const blueNotUsingKeyControls = this.state.isBlueUsingKeyboard === false,
		      redNotUsingKeyControls = this.state.isRedUsingKeyboard === false,
		      isBlueTurn = this.state.isBlueTurn === true;

		if((blueNotUsingKeyControls && isBlueTurn) || 
			 (redNotUsingKeyControls && !isBlueTurn)){
			console.log('Keyboard is off');
			return;
		}

		this.checkForGameOver();
		const gameOver = this.isGameOver;
		if(gameOver){
			this.setState({keyboardTargetSpirit: null});
			return;
		};

		const CARD_SELECT_STATE = 0,
		      PIECE_SELECT_STATE = 1,
		      MOVE_SELECT_STATE = 2;

		const isCardSelectState = this.keyboardState === CARD_SELECT_STATE,
		      isPieceSelectState = this.keyboardState === PIECE_SELECT_STATE,
		      isMoveSelectState = this.keyboardState === MOVE_SELECT_STATE;

		const ARROW_UP = 'ArrowUp',
		      ARROW_DOWN = 'ArrowDown',
		      ARROW_LEFT = 'ArrowLeft',
		      ARROW_RIGHT = 'ArrowRight',
		      SELECT_ONE = 'Control',
		      SELECT_TWO = 'Enter',
		      BACK = 'Shift';

		let keyPressed = event.key;
		const pressedSelect = (keyPressed === SELECT_ONE) || (keyPressed === SELECT_TWO),
		      highlightedSpirit = this.state.keyboardTargetSpirit,
		      highlightedPiece = this.state.keyboardTargetSpace;

		const NO_SELECTED_CARD = null,
		      FIRST_BLUE_CARD = 0,
		      SECOND_BLUE_CARD = 1,
		      FIRST_RED_CARD = 3,
		      SECOND_RED_CARD = 4;



		function handleSpaceSelect(direction, target){
			let keySpace = target;
			const SPACE_BETWEEN_ROWS = 5,
			      OTHER_SPACES_PER_ROW = 4,
			      SPACES_BETWEEN_FIRST_AND_LAST_ROW = 20;

			if(direction === ARROW_UP){
				const LAST_SPACE_FIRST_ROW = 4;
				if(keySpace <= LAST_SPACE_FIRST_ROW){
					keySpace += SPACES_BETWEEN_FIRST_AND_LAST_ROW;
					return keySpace;
				} else {
					keySpace -= SPACE_BETWEEN_ROWS;
					return keySpace;
				}
			}

			if(direction === ARROW_DOWN){
				const FIRST_SPACE_LAST_ROW = 20;
				if(keySpace >= FIRST_SPACE_LAST_ROW){
					keySpace -= SPACES_BETWEEN_FIRST_AND_LAST_ROW;
					return keySpace;
				} else {
					keySpace += SPACE_BETWEEN_ROWS;
					return keySpace;
				}
			}

			if(direction === ARROW_LEFT){
				const isLeftmost = (keySpace % SPACE_BETWEEN_ROWS) === 0;
				if(isLeftmost) {
					keySpace += OTHER_SPACES_PER_ROW;
					return keySpace;
				} else {
					keySpace -= 1;
					return keySpace;
				}
			}

			if(direction === ARROW_RIGHT){
				const isRightmost = 
					((keySpace - OTHER_SPACES_PER_ROW) % SPACE_BETWEEN_ROWS) === 0;
				if(isRightmost){
					keySpace -= OTHER_SPACES_PER_ROW;
					return keySpace;
				} else {
					keySpace += 1;
					return keySpace;
				}
			}
			//This should never be called due to other conditionals surrounding function, 
			//but any other key should not influence return value anyways
			return target; 
		}

		if(isCardSelectState){ //Selecting card
			if(keyPressed === ARROW_UP || keyPressed === ARROW_DOWN){
				const secondCardIsHighlighted = highlightedSpirit === SECOND_BLUE_CARD || 
				                                highlightedSpirit === SECOND_RED_CARD;
				if((highlightedSpirit === NO_SELECTED_CARD) || secondCardIsHighlighted){
					(isBlueTurn) ? this.setState({keyboardTargetSpirit: FIRST_BLUE_CARD}) :
                         this.setState({keyboardTargetSpirit: FIRST_RED_CARD});
				} else {
					(isBlueTurn) ? this.setState({keyboardTargetSpirit: SECOND_BLUE_CARD}) :
                         this.setState({keyboardTargetSpirit: SECOND_RED_CARD});
				}
			}
			if(pressedSelect && highlightedSpirit !== NO_SELECTED_CARD){
				const TOP_LEFT_PIECE = 0,
				      TOP_RIGHT_PIECE = 4;
				this.keyboardState = PIECE_SELECT_STATE;
				this.setState({selectedSpirit: highlightedSpirit});
				(isBlueTurn) ? this.setState({keyboardTargetSpace: TOP_LEFT_PIECE}) :
                       this.setState({keyboardTargetSpace: TOP_RIGHT_PIECE});
				this.setState({mouseSquare: this.state.keyboardTargetSpace},
											() => this.highlightMoves());
			}
		} else if(isPieceSelectState){ //Selecting piece
			const highlightedPiece = this.state.keyboardTargetSpace;
			if(keyPressed === BACK){
				this.keyboardState = CARD_SELECT_STATE;
				this.setState({selectedSpirit: null});
				(isBlueTurn) ? this.setState({keyboardTargetSpirit: FIRST_BLUE_CARD}) :
				             this.setState({keyboardTargetSpirit: FIRST_RED_CARD});
				this.setState({keyboardTargetSpace: null});
				this.setState({mouseSquare: null}, () => this.highlightMoves());
			}
			if(keyPressed === ARROW_UP || keyPressed === ARROW_DOWN ||
				 keyPressed === ARROW_LEFT || keyPressed === ARROW_RIGHT){
				this.setState({keyboardTargetSpace: 
											 handleSpaceSelect(keyPressed, this.state.keyboardTargetSpace)});
				this.setState({mouseSquare: this.state.keyboardTargetSpace},
											() => this.highlightMoves());
				const EMPTY = 0;
				if(this.state.pieces[this.state.keyboardTargetSpace] === EMPTY){
					 this.makeNoSpacesHighlighted();
				}
			}
			if(pressedSelect){
				const unselecting = this.state.selectedPiece === this.state.keyboardTargetSpace;
				if(unselecting) {
					this.setState({selectedPiece: null});
				} else {
					console.log("Selecting new piece");
					const pieces = this.state.pieces;

					const BLUE_PUPPET = 1,
					      BLUE_ONMYO = 2;
					const isLegalBlueSelection = pieces[highlightedPiece] === BLUE_PUPPET ||
																			 pieces[highlightedPiece] === BLUE_ONMYO;
					const RED_PUPPET = 3,
					      RED_ONMYO = 4;
					const isLegalRedSelection = pieces[highlightedPiece] === RED_PUPPET ||
																			pieces[highlightedPiece] === RED_ONMYO;

					const isLegalSelection = (isLegalBlueSelection && isBlueTurn) ||
                                   (isLegalRedSelection && !isBlueTurn);
					if(isLegalSelection){
						this.keyboardState = MOVE_SELECT_STATE;
						console.log("setting move select state");	
						this.setState({selectedPiece: this.state.keyboardTargetSpace});

					} else {
						console.log('Selection not legal');
					}
				}
			}
		} else if(isMoveSelectState){ //Selecting move
			if(pressedSelect){
				const selectedSamePieceTwice = this.state.keyboardTargetSpace === this.state.selectedPiece;
				if(selectedSamePieceTwice){
					keyPressed = BACK;
				} else {
					const pieces = this.state.pieces;

					const BLUE_PUPPET = 1,
					      BLUE_ONMYO = 2;
					const isBlueFriendlyPiece = (pieces[highlightedPiece] === BLUE_PUPPET) || 
																			(pieces[highlightedPiece] === BLUE_ONMYO);
					const RED_PUPPET = 3,
					      RED_ONMYO = 4;
					const isRedFriendlyPiece = (pieces[highlightedPiece] === RED_PUPPET) ||
																		 (pieces[highlightedPiece] === RED_ONMYO);

					const isFriendlyPiece = (isBlueFriendlyPiece && this.state.isBlueTurn) ||
																 (isRedFriendlyPiece && !this.state.isBlueTurn);

					const isHighlightedSpace = this.state.highlightedSpacesToRender[this.state.keyboardTargetSpace] === true,
				        legalMove = isHighlightedSpace && !isFriendlyPiece;

					if(legalMove){
						const EMPTY_SPACE = 0;
						// const selectedEmptySpace = pieces[highlightedPiece] === EMPTY_SPACE;

						//Make move
						const selectedPiece = this.state.selectedPiece;
						pieces[highlightedPiece] = this.state.pieces[selectedPiece];
						pieces[selectedPiece] = EMPTY_SPACE;
						this.setState({pieces: pieces});
						this.setState({selectedSpace: null});

						//Unhighlight all spaces
						this.makeNoSpacesHighlighted();

						//Players switch turns
						const nextTurn = !isBlueTurn;
						this.switchTurns();

						//Switch spirit used with neutral card
						const NEUTRAL_CARD = 2;
						const usedSpiritLocation = this.state.selectedSpirit,
						      usedSpirit = this.state.spiritCards[usedSpiritLocation],
						      spiritToSwitch = this.state.spiritCards[NEUTRAL_CARD],
						      newCardOrder = this.state.spiritCards;

						newCardOrder[usedSpiritLocation] = spiritToSwitch;
						newCardOrder[NEUTRAL_CARD] = usedSpirit;
						this.setState({spiritCards: newCardOrder})
						this.setState({selectedSpirit: null});

						//Turn off keyboard interaction so the blue player can't do things during red's turn
						// const blueNotUsingKeyControls = this.state.isBlueUsingKeyboard === false;
						// const redNotUsingKeyControls = this.state.isRedUsingKeyboard === false;
						// const IS_BLUE_TURN = this.state.isBlueTurn;
						
						if((blueNotUsingKeyControls && isBlueTurn) ||
							 (redNotUsingKeyControls && !isBlueTurn)){
							this.keyboardState = null;
						} else {
							this.keyboardState = CARD_SELECT_STATE;
							const isGameOver = this.checkForGameOver();
							if(isGameOver){
								this.setState({keyboardTargetSpirit: null});
							}
						}

						const justBecameBlueTurn = nextTurn;

						if(!blueNotUsingKeyControls && justBecameBlueTurn){
							const isGameOver = this.checkForGameOver();
							if(isGameOver){
								this.setState({keyboardTargetSpirit: null});
							} else {
								this.setState({keyboardTargetSpirit: FIRST_BLUE_CARD});
							}
						} else if(!redNotUsingKeyControls && !justBecameBlueTurn){
							const isGameOver = this.checkForGameOver();
							if(isGameOver){
								this.setState({keyboardTargetSpirit: null});
							} else {
								this.setState({keyboardTargetSpirit: FIRST_RED_CARD});
							}
						} else {
							this.setState({keyboardTargetSpirit: null});
						}

						this.setState({keyboardTargetSpace: null});
					} else {
						console.log("Illegal move!");
					}
				}
			}

			if(keyPressed === BACK){
				this.keyboardState = isPieceSelectState;
				this.setState({selectedPiece: null});
				this.makeNoSpacesHighlighted();
			}

			if(keyPressed === ARROW_UP || keyPressed === ARROW_DOWN ||
				 keyPressed === ARROW_LEFT || keyPressed === ARROW_RIGHT){
				 this.setState({keyboardTargetSpace: 
											  handleSpaceSelect(keyPressed, this.state.keyboardTargetSpace)});
			}
		}
	}

	handleSpaceClick(spaceLocation, selectedPiece){ 
		const pieces = this.state.pieces;

		const gameOver = this.isGameOver === true,
		      selectedNewSpace = (selectedPiece !== spaceLocation) && 
		                         (selectedPiece !== null),
		      isNoSelectedSpace = selectedPiece === (null),
		      selectedEmptySpace = pieces[spaceLocation] === this.pieceType.EMPTY_SPACE,
		      spaceIsHighlighted = this.state.highlightedSpacesToRender[spaceLocation],
		      selectedBluePiece = (pieces[spaceLocation] === this.pieceType.BLUE_PUPPET) || 
		      										(pieces[spaceLocation] === this.pieceType.BLUE_ONMYO),
		      selectingOwnPiece = (this.state.isBlueTurn && selectedBluePiece) ||
															(!this.state.isBlueTurn && !selectedBluePiece && !selectedEmptySpace),
		      selectingAnotherAlly = selectingOwnPiece && selectedNewSpace,
	        unselecting = (this.state.selectedSpace === selectedPiece) && !selectingAnotherAlly;

		//Move a selected piece if the following conditions are met:
		if(selectedNewSpace && spaceIsHighlighted && !selectingAnotherAlly) {

			// const tookEnemyPiece = !selectedEmptySpace;
			// if(this.state.isBlueTurn && tookEnemyPiece) this.redPieceCount--;
			// if(!this.state.isBlueTurn && tookEnemyPiece) this.bluePieceCount--;

			//Tell Game that this piece is now selected
			pieces[spaceLocation] = this.state.pieces[selectedPiece];
			pieces[selectedPiece] = this.pieceType.EMPTY_SPACE;
			this.setState({pieces: pieces});
			this.setState({selectedSpace: null});

			//Players switch turns
			const nextTurn = !this.state.isBlueTurn;
			this.switchTurns();
			
			//Switch spirit used with neutral card
			const NEUTRAL_CARD = 2;

			const usedSpiritLocation = this.state.selectedSpirit,
			      usedSpirit = this.state.spiritCards[usedSpiritLocation], 
			      spiritToSwitch = this.state.spiritCards[NEUTRAL_CARD],
			      newCardOrder = this.state.spiritCards;

			newCardOrder[usedSpiritLocation] = spiritToSwitch;  
			newCardOrder[NEUTRAL_CARD] = usedSpirit; 
			this.setState({spiritCards: newCardOrder});
			this.setState({selectedSpirit: null});

			const blueTurn = nextTurn,
			      blueTurnAndKeyboard = blueTurn && this.state.isBlueUsingKeyboard,
			      redTurnAndKeyboard = !blueTurn && this.state.isRedUsingKeyboard;

			//Highlight the keyboard and first card for the next player if they're using it
			if(blueTurnAndKeyboard || redTurnAndKeyboard){

				const SELECT_CARD_STATE = 0,
				      FIRST_BLUE_CARD = 0,
				      FIRST_RED_CARD = 3;

				this.keyboardState = SELECT_CARD_STATE;
				
				(blueTurnAndKeyboard) ? (this.setState({keyboardTargetSpirit: FIRST_BLUE_CARD})) :
																(this.setState({keyboardTargetSpirit: FIRST_RED_CARD}));
			  console.log("Focusing");
				this.playArea.focus();

			}

		} else if(selectingAnotherAlly){ //Select a different piece to move
			
			this.setState({selectedSpace: spaceLocation}, () => this.highlightMoves());

		} else if(isNoSelectedSpace && !gameOver) { //Select a piece to move
			if(!selectedEmptySpace && selectingOwnPiece){
				// console.log('Created a first selection');
				this.setState({selectedSpace: spaceLocation});
			}

		} else if(unselecting) { //Unselect a piece
			const selectedValue = pieces[selectedPiece];
			this.setState({selectedSpace: null});
			pieces[selectedPiece] = selectedValue; 
			this.makeNoSpacesHighlighted();
		}
	}

	highlightMoves() {
		let focusSpace = null;
		const selectedSpace = this.state.selectedSpace,
		      mouseSquare = this.state.mouseSquare;
		if(selectedSpace !== null){
			focusSpace = selectedSpace;
		} else{
			focusSpace = mouseSquare;
		}

		const HIGHLIGHT_NOTHING = null;

		if(focusSpace === null){
			this.makeNoSpacesHighlighted();
			return HIGHLIGHT_NOTHING;
		}

		if(this.state.selectedSpirit === null) return HIGHLIGHT_NOTHING;

		const redPiece = (this.state.pieces[focusSpace] === this.pieceType.RED_PUPPET ||
											 this.state.pieces[focusSpace] === this.pieceType.RED_ONMYO);

		if(this.state.pieces[focusSpace] === this.pieceType.EMPTY_SPACE) return HIGHLIGHT_NOTHING;
		if(this.state.isBlueTurn && redPiece) return HIGHLIGHT_NOTHING;
		if(!this.state.isBlueTurn && !redPiece) return HIGHLIGHT_NOTHING;

		//Clear old displayed moves
		//This has to be set directly, as async will not clear old highlighted spaces
		//if mouse moves too quickly. A setState() will be called when the new highlighted
		//spaces are determined at the end of this function, and DOM will update as intended.
		const SPACES_ON_BOARD = 25,
		      HIGHLIGHTED_STATE = false;
		this.highlightedSpaces = Array(SPACES_ON_BOARD).fill(HIGHLIGHTED_STATE);

		const moves = this.movesInPerspective(this.state.isBlueTurn, 
																					this.getMoves());

		for(let i = 0; i < moves.length; i++){
			const THEORETICAL_MOVE = 2;
			if(moves[i] === THEORETICAL_MOVE){
				// const translatedMove = translateMove(i, xDifference, yDifference);
				const translatedMove = this.translateMove(i);
				if(translatedMove !== null){
					this.addToHighlightList(translatedMove);
				}
			}
		}
		this.setState({highlightedSpacesToRender: this.highlightedSpaces});
	}

	makeNoSpacesHighlighted() {
		const SPACES_ON_BOARD = 25,
		      HIGHLIGHTED_STATE = false,
		      NOTHING_HIGHLIGHTED = Array(SPACES_ON_BOARD).fill(HIGHLIGHTED_STATE);
		this.setState({highlightedSpacesToRender: NOTHING_HIGHLIGHTED});
	}

	movesInPerspective(isBlue, moves) {
		let translatedMoves = [];
		translatedMoves.length = moves.length;

		const ROW_LENGTH = 5;

		if(isBlue){
			for(let i = 0; i < moves.length; i++){
			//convert to x/y
			let x = i % ROW_LENGTH,
			    y = Math.floor(i / ROW_LENGTH);

			//find new x/y
			let newX = ROW_LENGTH - y - 1,
			    newY = x;

			//convert back to index
			let newPosition = newY * ROW_LENGTH + newX;
			translatedMoves[newPosition] = moves[i];
			}
		} else { //red
			for(let i = 0; i < moves.length; i++){
			//convert to x/y
			let x = i % ROW_LENGTH,
			    y = Math.floor(i / ROW_LENGTH);

			//find new x/y
			let newX = y,
			    newY = ROW_LENGTH - x - 1; 

			//convert back to index
			let newPosition = newY * ROW_LENGTH + newX;
			translatedMoves[newPosition] = moves[i];
			}
		}
		return translatedMoves;
	}

	onMouseOut(location) {
		//since set state is async, pass in highlight moves as a callback
		this.setState({mouseSquare: null}, 
									() => this.highlightMoves()); 
	}

	onMouseOver(location) {
		if(this.state.mouseSquare !== location){
			this.setState({mouseSquare: location},
										 () => this.highlightMoves());
		}
	}

	produceTurnDisplay() {
		let statement = "",
		    gameOutcome = null;

		if(this.isFirstTurn){
			
			if(this.state.isBlueTurn){
				statement = "Blue will move first";
			} else {
				statement = "Red will move first";
			}
			return statement;
		}

		gameOutcome = this.checkForGameOver();
		

		if(gameOutcome !== null){
			return gameOutcome;
		}

		if(this.state.isBlueTurn){
			statement = "Turn: Blue Player";
		} else {
			statement = "Turn: Red Player";
		}
		return statement;
	}

	randomizeFirstTurn() {
		let isBlueTurn = false;
		const randomPercent = Math.random();
		
		const FIFTY_PERCENT = 0.5;
		if(randomPercent >= FIFTY_PERCENT){
			isBlueTurn = true;
		}
		return isBlueTurn;
	}

	renderCard(cardData, selectedCard, location){
		const LAST_BLUE_CARD = 1,
		      NEUTRAL_CARD = 2,
		      FIRST_RED_CARD = 3;
		let isBlueCard = true;

		let moveSpace;
		if(location <= LAST_BLUE_CARD) {
			moveSpace = this.movesInPerspective(isBlueCard, cardData.moveSpace);
		} else if (location >= FIRST_RED_CARD) {
			isBlueCard = false;
			moveSpace = this.movesInPerspective(isBlueCard, cardData.moveSpace);
		} else {
				moveSpace = cardData.moveSpace;
		}

		let isKeyTarget = false;

		let keyTarget = null;
		const CARD_SELECT_STATE = 0;
		if(this.keyboardState === CARD_SELECT_STATE){
			keyTarget = this.state.keyboardTargetSpirit;
		}

		if(keyTarget === location) {
			isKeyTarget = true;
		}

		function renderMSSquare(keyGen, squareType, location) { //Movespace square
			const key = keyGen();
			return(
				<MiniSquare 
					key={key}
					location={location}
					squareType={squareType}
				/>
			);
		}

		function generateHumanReadableMovespace
			(moves, neutralTransformed, isBlueTurn, keyGen) {
			const NUMBER_OF_ROWS = 5;
			let spaceCount = 0,
			    rows = [],
			    locationType = location;
			for(let rowCount = 0; rowCount < NUMBER_OF_ROWS; rowCount++) {
				let tempRow = [];

				for(let i = 0; i < NUMBER_OF_ROWS; i++, spaceCount++) {
					if(neutralTransformed){
						if(isBlueTurn){
							locationType = LAST_BLUE_CARD; 
						} else {
							locationType = FIRST_RED_CARD; 
						}
					}

					tempRow.push(renderMSSquare(() => keyGen(), moves[spaceCount], locationType));
				}
					const key = keyGen();
					rows.push(<div className="board-row" key={key}>{tempRow}</div>);
		  }
		  return rows;
		}

		let isNeutralTransformDisplay = false;
		const isBlueTurn = this.state.isBlueTurn === true,
		      movesDisplayedOnCard = 
		      	generateHumanReadableMovespace(
		      		moveSpace,
							isNeutralTransformDisplay, 
							isBlueTurn, 
							() => this.generateKey()
						);
		
		if(location === NEUTRAL_CARD){
			isNeutralTransformDisplay = true;
			
			const rotatedNeutralMoves = 
				this.movesInPerspective(this.state.isBlueTurn, moveSpace);
			
			this.neutralToRotate = 
				generateHumanReadableMovespace(
					rotatedNeutralMoves, 
			    isNeutralTransformDisplay, 
			    isBlueTurn, 
			    () => this.generateKey()
		    );
		}

		return(
			<SpiritCard
				engName={cardData.engName}
				hanzi={cardData.hanzi}
				isKeyTarget={isKeyTarget}
				location={location}
				moveSpace={moveSpace}
				movesToDisplay={movesDisplayedOnCard}
				onClick={() => this.handleCardClick(location, selectedCard)}
				selectedCard={selectedCard}
			/>
		);
	}

	setTimes(minutes, seconds, isBlue) {
		if(isBlue) {
			this.blueTime = [minutes, seconds];
		} else {
			this.redTime = [minutes, seconds];
		}
	}

	switchTurns() {
		let nextTurn = !this.state.isBlueTurn;
		if(this.isFirstTurn) this.isFirstTurn = false;

		const DECIMAL_RADIX = 10,
		      MINUTES_SLOT = 0,
		      SECONDS_SLOT = 1;
		if(nextTurn === true) { //if blue turn
			this.turnTimerBlue = this.countDown(
				parseInt(this.blueTime[MINUTES_SLOT], DECIMAL_RADIX), 
				parseInt(this.blueTime[SECONDS_SLOT], DECIMAL_RADIX), 
				nextTurn); 

			this.turnTimerRed = "";
			
		} else { //if red turn
			this.turnTimerblue = "";
			this.turnTimerRed = this.countDown(
				parseInt(this.redTime[MINUTES_SLOT], DECIMAL_RADIX), 
			  parseInt(this.redTime[SECONDS_SLOT], DECIMAL_RADIX), 
		 	  nextTurn);

		}

		this.setState({isBlueTurn: nextTurn});
		this.makeNoSpacesHighlighted();
		const legalMovesAreRemaining = this.areThereLegalMovesRemaining(nextTurn);

		//Have to assign legalMovesRemaining to this directly, as async does not return it to us
		//in time otherwise. It needs to be in the callback of the setState switched turn.
		if(!legalMovesAreRemaining && !(this.isGameOver === true)){
				let player = "RED";
			if(nextTurn){
				player = "BLUE";
			}
			console.log("NO POSSIBLE MOVES FOR " + player +".\n SWITCHING TURNS.");
			alert("NO POSSIBLE MOVES FOR " + player +".\n SWITCHING TURNS.");
			nextTurn = !nextTurn;
			this.setState({isBlueTurn: nextTurn});
			this.makeNoSpacesHighlighted();
		}
	}

	translateMove(space, focusSpace){
		if(focusSpace === undefined) {
			const selectedSpace = this.state.selectedSpace,
			      mouseSquare = this.state.mouseSquare;
			if(selectedSpace !== null){
				focusSpace = selectedSpace;
			} else{
				focusSpace = mouseSquare;
			}
		}

		const SPACES_PER_ROW = 5,
		      CENTER_COORD = 2,
		      ILLEGAL_MOVE = null;

		const xLocation = (focusSpace % SPACES_PER_ROW),
		      yLocation = Math.floor(focusSpace/SPACES_PER_ROW),
		      xDifference = CENTER_COORD - xLocation, //Pos. dif crop left, neg dif crop right
		      yDifference = CENTER_COORD - yLocation; //Pos. dif crop top, neg dif crop bot
		
		const x = space % SPACES_PER_ROW,
		      y = Math.floor(space/SPACES_PER_ROW);

		const newX = x - xDifference,
		      newY = y - yDifference;

		const MIN_ROWCOL = 0,
		      MAX_ROWCOL = 4;
		if(newX < MIN_ROWCOL || newX > MAX_ROWCOL) return ILLEGAL_MOVE;
		if(newY < MIN_ROWCOL || newY > MAX_ROWCOL) return ILLEGAL_MOVE;

		let newSpace = space;
		newSpace = newY * SPACES_PER_ROW + newX;
		return newSpace;
	}
	


	render() {
		let currentCard = 0;
		const playerOneCardOne = 
			this.renderCard(this.state.spiritCards[currentCard], 
											this.state.selectedSpirit, currentCard);
		currentCard++;
		const playerOneCardTwo = 
			this.renderCard(this.state.spiritCards[currentCard], 
											this.state.selectedSpirit, currentCard);
		currentCard++;
		const neutralCard = 
			this.renderCard(this.state.spiritCards[currentCard], 
											this.state.selectedSpirit, currentCard);
		currentCard++;
		const playerTwoCardOne = 
			this.renderCard(this.state.spiritCards[currentCard], 
											this.state.selectedSpirit, currentCard);
		currentCard++;
		const playerTwoCardTwo = 
			this.renderCard(this.state.spiritCards[currentCard], 
											this.state.selectedSpirit, currentCard);
		
		const keyMap = {
			'arrowUp': 'up',
			'arrowDown': 'down',
			'arrowLeft': 'left',
			'arrowRight': 'right',
			'select': ['ctrl','enter'],
			'back': 'shift',
		}

		const handlers = {
			'arrowUp': (event) => this.handleKeyInput(event),
			'arrowDown': (event) => this.handleKeyInput(event),
			'arrowLeft': (event) => this.handleKeyInput(event),
			'arrowRight': (event) => this.handleKeyInput(event),
			'select': (event) => this.handleKeyInput(event),
			'back': (event) => this.handleKeyInput(event),
		};

		//Properly display neutral card and its coming transformation
		let blueTransformedNeutral = null,
		    redTransformedNeutral = null;

		let neutralClass;
		const ARROW_DIMENSIONS = 64;
		if(this.state.isBlueTurn){
			blueTransformedNeutral =
			<div className="blueArrowAndMoves">
				<div className="blueArrowAndMoves__movesAligner">
					{this.neutralToRotate}
				</div>
				<img 
					src={img_arrowLeft} 
					alt="Blue will gain"
					className="blueArrowAndMoves__arrow"
					height={ARROW_DIMENSIONS}
					width={ARROW_DIMENSIONS}
					draggable="false" 
			 	/>
			</div>;
			neutralClass = "neutralBand__neutralToBlue";
		} else {
			redTransformedNeutral =
			<div className="redArrowAndMoves">
				<div className="readArrowAndMoves__movesAligner">
					{this.neutralToRotate}
				</div>
				<img 
					src={img_arrowRight} 
					alt="Red will gain"
					className="redArrowAndMoves__arrow"
					height={ARROW_DIMENSIONS}
					width={ARROW_DIMENSIONS} 
					draggable="false" 
			 	/>
			</div>;
			neutralClass = "neutralBand__neutralToRed";
		}

		//Display 'game over' where the neutral card renders
		let gameOverDisplay =
		<div style={{marginTop: "60px"}}>
			{this.produceTurnDisplay()}
		</div>;
		let neutralBand = 
		<div className="neutralBand neutralBand--gameOver" >
			{gameOverDisplay}
		</div>;

		if(!this.isGameOver){
			neutralBand = 
				<div className="neutralBand" >
					<div>
						{blueTransformedNeutral}
					</div>
					<div className={neutralClass}>
						{neutralCard}
					</div>
					<div>
						{redTransformedNeutral}
					</div>
				</div>;
		}

		//Properly display timers over player's cards
		let blueSide, redSide;
		const MINUTES_SLOT = 0,
					SECONDS_SLOT = 1;
		if(this.props.areTurnTimersInUse) {

			if(this.isGameOver) { //Freeze the timer display when the game ends
				 this.formatSeconds();

				const blueTimeText = 
					<div className="timer">
						{this.blueTime[MINUTES_SLOT] + ":" + 
						 this.blueTime[SECONDS_SLOT]}
					</div>;

				const redTimeText = 
					<div className="timer">
						{this.redTime[MINUTES_SLOT] + ":" + 
						 this.redTime[SECONDS_SLOT]}
					</div>;

				blueSide = 
					<div className="playerOneCards">
						{blueTimeText}
						{playerOneCardOne}
						{playerOneCardTwo}
					</div>;

				redSide = 
					<div className="playerTwoCards">
						{redTimeText}
						{playerTwoCardOne}
						{playerTwoCardTwo}
					</div>;

			} else if(this.state.isBlueTurn) { //Timers for blue's turn
				const BlueTimer = this.turnTimerBlue;
				this.formatSeconds();

				const redTimer = 
				<div className="timer">
					{this.redTime[MINUTES_SLOT] + ":" + 
					 this.redTime[SECONDS_SLOT]}
				</div>;

				blueSide = 
				<div className="playerOneCards">
					<BlueTimer />
					{playerOneCardOne}
					{playerOneCardTwo}
				</div>;

				redSide =
				<div className="playerTwoCards">
					{redTimer}
					{playerTwoCardOne}
					{playerTwoCardTwo}
				</div>;

			}	else { //Timers for red's turn
				this.formatSeconds();

				const blueTimer = 
				<div className="timer">
					{this.blueTime[MINUTES_SLOT] + ":" + 
					 this.blueTime[SECONDS_SLOT]}
				</div>;

				const RedTimer = this.turnTimerRed;

				blueSide = 
				<div className="playerOneCards">
					{blueTimer}
					{playerOneCardOne}
					{playerOneCardTwo}
				</div>;

				redSide =
				<div className="playerTwoCards">
					<RedTimer />
					{playerTwoCardOne}
					{playerTwoCardTwo}
				</div>;
			}
		} else { //Timers are turned off

			blueSide = 
			<div className="playerOneCards 
                      playerOneCards--timerOff">
				{playerOneCardOne}
				{playerOneCardTwo}
			</div>;

			redSide = 
			<div className="playerTwoCards 
                      playerTwoCards--timerOff">
				{playerTwoCardOne}
				{playerTwoCardTwo}
			</div>;
		}

		return(
			
			<div className="noSelectOni">
				<HotKeys keyMap={keyMap}  handlers={handlers}>
				<div className="menuReturn">
						<button className="menuReturn__btn" 
										onClick={() => this.props.backToMenu()}>
							{"Return to menu"}
						</button>
					</div>
					<div className="playArea" tabIndex="0" autoFocus ref={(e) => {this.playArea = e;}}>
						{blueSide}
						<div className="board">
							<p className="board__turnInfo">
								{this.produceTurnDisplay()}
							</p>
							<Board 
								highlightedSpaces={this.state.highlightedSpacesToRender}
								isBlueTurn={this.state.isBlueTurn}
								keyGen={() => this.generateKey()}
								keyboardSelectedSpace={this.state.keyboardTargetSpace}
								movesToDisplay={this.getMoves()}
								onClick={(i, selectedPiece) => 
													this.handleSpaceClick(i, selectedPiece)}
								onMouseOut = {(location) => this.onMouseOut(location)}
								onMouseOver = {(location) => this.onMouseOver(location)}
								pieces={this.state.pieces} 
								pieceType={this.pieceType}
								selected={this.state.selectedSpace}
								selectedSpirit={this.state.selectedSpirit}	
							/>		
						</div>
						{redSide}
						{neutralBand}
					</div>
				
					
				</HotKeys>
			</div>
			
		);
	}
}

Game.propTypes = {
	areTurnTimersInUse: PropTypes.bool,
	backToMenu: PropTypes.func,
	isBlueUsingKeyboard: PropTypes.bool,
	isRedUsingKeyboard: PropTypes.bool,
	isThereMinTurnTime: PropTypes.bool,
	minTurnTime: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
		]),
	turnMinutes: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
		]),
	turnSeconds: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
		])
}

export default Game;

