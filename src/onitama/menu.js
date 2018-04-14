//TO DO:
//-Enforce digits only in the timers

import React from 'react';
import Game from './onitama.js';
import MenuOptions from './menuOptions.js';
import './menu.css';
import Rules from './rules.js';
import img_shrine from './images/shintoShrine.png';

class Menu extends React.Component {
	constructor(props) {
		super(props);
		const DEFAULT_OUT_OF_TIME_TIME = 0, //seconds
		      DEFAULT_TURN_TIMER_MINUTES = 5,
		      DEFAULT_TURN_TIMER_SECONDS = 0;
		this.state = {
			areOptionsDisplayed: false,
			areRulesDisplayed: false,
			areTurnTimersInUse: true,
			blueTime: [DEFAULT_TURN_TIMER_MINUTES, DEFAULT_TURN_TIMER_SECONDS],
			isBlueUsingKeyboard: false,
			isGameDisplayed: false,
			isRedUsingKeyboard: false,
			isThereMinTurnTime: false,
			outOfTimeTime: DEFAULT_OUT_OF_TIME_TIME,
			redTime: [DEFAULT_TURN_TIMER_MINUTES, DEFAULT_TURN_TIMER_SECONDS],
		}
		this.handleChangeMinute = this.handleChangeMinute.bind(this);
		this.handleChangeMinTurnTime = this.handleChangeMinTurnTime.bind(this);
	}

	handleChangeMinTurnTime(event) {
		this.setState({outOfTimeTime: event.target.value});
	}

	handleChangeMinute(event) {
		const SECONDS_SLOT = 1; //[minutes:seconds], space '1' = seconds
		const seconds = this.state.blueTime[SECONDS_SLOT];
		this.setState({blueTime: [event.target.value, seconds]});
		this.setState({redTime: [event.target.value, seconds]});
	}

	handleChangeSecond(event) {
		const MINUTES_SLOT = 0; //[minutes:seconds], space '0' = minutes
		const minutes = this.state.blueTime[MINUTES_SLOT];
		this.setState({blueTime: [minutes, event.target.value]});
		this.setState({redTime: [minutes, event.target.value]});
	}

	// checkIfInputIsDigits(input) {
	// 	let isDigits = false;

	// 	return isDigits;
	// }

	

	playOnClick() {
		const toggledState = !this.state.isGameDisplayed;
		this.setState({isGameDisplayed: toggledState});
	}

	returnToMenuFromPlay() {
		const toggledState = !this.state.isGameDisplayed;
		this.setState({isGameDisplayed: toggledState});
	}

	setMinTurnTime(seconds) {
		const MAXIMUM_MIN_TURN_TIME = 60; //seconds
		if(seconds <= MAXIMUM_MIN_TURN_TIME){
			this.setState({outOfTimeTime: seconds});
		} else {
			alert("Maximum minimum turn time is 60 seconds.");
		}
	}

	toggleKeyboardControls(isBlue) {
		if(isBlue){
			const isBlueUsingKeyboard = this.state.isBlueUsingKeyboard;
			this.setState({isBlueUsingKeyboard: !isBlueUsingKeyboard});
		} else {
			const isRedUsingKeyboard = this.state.isRedUsingKeyboard;
			this.setState({isRedUsingKeyboard: !isRedUsingKeyboard});
		}
	}

	toggleMinTurnTime() {
		const toggledState = !this.state.isThereMinTurnTime;
		this.setState({isThereMinTurnTime: toggledState});
	}

	toggleOptions() {
		const toggledState = !this.state.areOptionsDisplayed;
		this.setState({areOptionsDisplayed: toggledState});
	}

	toggleRules() {
		const toggledState = !this.state.areRulesDisplayed;
		this.setState({areRulesDisplayed: toggledState});
	}

	toggleTurnTimer() {
		const toggledState = !this.state.areTurnTimersInUse;
		this.setState({areTurnTimersInUse: toggledState});
	}



	render() {
		const TITLE = "Minimalist Onitama",
		      PLAY_BUTTON_TEXT = "Play",
		      RULES_BUTTON_TEXT = "Rules",
		      OPTIONS_BUTTON_TEXT = "Options",
		      CREDIT_SPACING = "\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0",
		      CREDIT_TEXT = "Game design by: Shimpei Sato" + 
												 CREDIT_SPACING + CREDIT_SPACING + CREDIT_SPACING +
												"Application by: Pierce Carruthers",
					DISCLAIMER = "This application has no official affiliation with Shimpei Sato or any of Onitama's publishers, including minimalGames and Arcane Wonders.";

		const menuScreen = 
				
		<div className="noSelect">
			<link href="https://fonts.googleapis.com/css?family=Comfortaa" rel="stylesheet"/>
			<div className="menu" >
				<h1 className="menu__title">
					{TITLE}
				</h1>
				<img className="menu__img--shrine" src={img_shrine} 
							alt="I hope you like shrines." draggable="false"/>
				
				<div >
					<button className="menu__button" onClick={() => this.playOnClick()}>
						{PLAY_BUTTON_TEXT}
					</button>
					<p/>
					<button className="menu__button" onClick={() => this.toggleRules()}>
						{RULES_BUTTON_TEXT}
					</button>
					<p/>
					<button className="menu__button" onClick={() => this.toggleOptions()}>
						{OPTIONS_BUTTON_TEXT}
					</button>
					<div className="menu__credit">
						<p>
							{CREDIT_TEXT}
						</p>
						<p/>
						{DISCLAIMER}
					</div>
				</div>
			</div>
		</div>;

		const MINUTES_SLOT = 0, //[minutes:seconds], space '0' = minutes
		      SECONDS_SLOT = 1; //[minutes:seconds], space '1' = seconds
		const gameScreen = 
				<Game 
					areTurnTimersInUse={this.state.areTurnTimersInUse}
					backToMenu={() => this.returnToMenuFromPlay()}
					isBlueUsingKeyboard={this.state.isBlueUsingKeyboard}
					isRedUsingKeyboard={this.state.isRedUsingKeyboard}
					isThereMinTurnTime={this.state.isThereMinTurnTime}
					minTurnTime={this.state.outOfTimeTime}
					turnMinutes={this.state.blueTime[MINUTES_SLOT]}
					turnSeconds={this.state.blueTime[SECONDS_SLOT]} 
				/>;

		const RULES_SCREEN =
		 <Rules toggleRules={() => this.toggleRules()}/>;

		const optionsScreen = 
			<MenuOptions
				areTurnTimersInUse={this.state.areTurnTimersInUse}
				blueMinutes={this.state.blueTime[MINUTES_SLOT]}
				blueSeconds={this.state.blueTime[SECONDS_SLOT]}
				handleChangeMinTurnTime={(event) => this.handleChangeMinTurnTime(event)}
				handleChangeMinute={(event) => this.handleChangeMinute(event)}
				handleChangeSecond={(event) => this.handleChangeSecond(event)}
				handleSubmit={(event) => this.handleSubmit(event)}
				isBlueUsingKeyboard={this.state.isBlueUsingKeyboard}
				isRedUsingKeyboard={this.state.isRedUsingKeyboard}
				isThereMinTurnTime={this.state.isThereMinTurnTime}
				minTurnTime={this.state.outOfTimeTime}
				setMinTurnTime={(seconds) => this.setMinTurnTime(seconds)}
				toggleKeyboardControls=
					{(isBlue) => this.toggleKeyboardControls(isBlue)}
				toggleMinTurnTime={() => this.toggleMinTurnTime()}
				toggleOptionsMenu={() => this.toggleOptions()}
				toggleTurnTimer={() => this.toggleTurnTimer()}
			/>;


		let screen = menuScreen;
		if(this.state.isGameDisplayed) {
			screen = gameScreen;
		} else if (this.state.areOptionsDisplayed) {
			screen = optionsScreen;
		} else if (this.state.areRulesDisplayed) {
			screen = RULES_SCREEN;
		}

		return(screen);
	}
}

export default Menu;