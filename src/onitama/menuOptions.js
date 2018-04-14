import React from 'react';
import PropTypes from 'prop-types';
import './menuOptions.css';

function MenuOptions(props) {

	const isBlueUsingKeyboard = props.isBlueUsingKeyboard,
	      isRedUsingKeyboard = props.isRedUsingKeyboard;

	function getKeyboardState(targetUsesKeyboard) {
		if(targetUsesKeyboard){
				return "On";
			} else {
				return "Off";
			}
	}

	let usingTurnTimerText = "Off",
	    turnTimerOptions = null;
	if(props.areTurnTimersInUse){

		let usingMinTurnTimeText = "Off",
		    minTurnTimeOptions = null;
		if(props.isThereMinTurnTime){
			usingMinTurnTimeText = "On";
			minTurnTimeOptions = 
			<div>
				<p/>
				<form>
					<label>
						Minimum seconds per turn: 
					</label>
					<input type="text" value={props.minTurnTime}
								 onChange={props.handleChangeMinTurnTime} />
				</form>
			</div>;

		}

		usingTurnTimerText = "On";
		turnTimerOptions = 
		<div>
			<p/>
				Turn Timer:
			<p/>
			<form >
				<label>
					Minute\s:
					<input type="text" value={props.blueMinutes} 
							 	 onChange={props.handleChangeMinute} />
				</label>
			</form>
			<form >
				<label>
					Second\s:
					<input type="text" value={props.blueSeconds} 
							 	 onChange={props.handleChangeSecond} />
				</label>
			</form>
			<p/>
			<button className="optionsMenu__button
			                   optionsMenu__button--minTurnTime"
							onClick={() => props.toggleMinTurnTime()}>
				{"Minimum turn time: " + usingMinTurnTimeText}
			</button>
			{minTurnTimeOptions}
		</div>;

	}

	let keyboardControlsInfo = null;
	if(isBlueUsingKeyboard || isRedUsingKeyboard) {
		keyboardControlsInfo =
		<div className="optionsMenu__keyboardInfo">
			<p>
				{"Move cursor = Arrow keys, Select = Ctrl or Enter, Undo = Shift"}
			</p>
			<p>
				{"Keyboard turn: Pick card -> Pick piece -> Pick space"}
			</p>
		</div>;
	}

	const BLUE_OPTIONS = true; //May have seperate red options later
	const optionsScreen = 
		<div className="optionsMenu">
			<button zindex="-1" className="optionsMenu__button"
			 onClick={() => props.toggleKeyboardControls(BLUE_OPTIONS)}>
				{"Blue keyboard: " + getKeyboardState(isBlueUsingKeyboard)}
			</button>
			<p/>
			<button zindex="-1" className="optionsMenu__button"
				onClick={() => props.toggleKeyboardControls(!BLUE_OPTIONS)}>
				{"Red keyboard: " + getKeyboardState(isRedUsingKeyboard)}
			</button>
				{keyboardControlsInfo}
			<p/>
			<button className="optionsMenu__button"
				onClick={() => props.toggleTurnTimer()}>
				{"Turn timers: " + usingTurnTimerText}
			</button>
			{turnTimerOptions}
			<p/>
			<button className="optionsMenu__button
												 optionsMenu__button--return"
							onClick={() => props.toggleOptionsMenu()} >
				{"Return to menu"}
			</button>
		</div>

	return(optionsScreen);
}

MenuOptions.propTypes = {
	areTurnTimersInUse: PropTypes.bool,
	blueMinutes: PropTypes.number,
	blueSeconds: PropTypes.number,
	handleChangeMinTurnTime: PropTypes.func,
	handleChangeMinute: PropTypes.func,
	handleChangeSecond: PropTypes.func,
	handleSubmit: PropTypes.func,
	isBlueUsingKeyboard: PropTypes.bool,
	isRedUsingKeyboard: PropTypes.bool,
	isThereMinTurnTime: PropTypes.bool,
	minTurnTime: PropTypes.number,
	setMinTurnTime: PropTypes.func,
	toggleKeyboardControls: PropTypes.func,
	toggleMinTurnTime: PropTypes.func,
	toggleOptionsMenu: PropTypes.func,
	toggleTurnTimer: PropTypes.func
}

export default MenuOptions;