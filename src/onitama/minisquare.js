import React from 'react';
import PropTypes from 'prop-types';
import './onitama.css';

function MiniSquare(props) {
	const EMPTY_SPACE = 0,
	      PIECE = 1, //theoretical piece
	      MOVE = 2; //possible move

	let squareClass;
		switch(props.squareType) {
			case(EMPTY_SPACE): 
				squareClass = "miniSquare";
				break;
			case(PIECE):
				squareClass = "miniSquare miniSquare--piece";
				break;
			case(MOVE):
				const LAST_BLUE_CARD = 1,
				      FIRST_RED_CARD = 3;

				if(props.location <= LAST_BLUE_CARD){
					squareClass = "move move--blue";
				} else if(props.location >= FIRST_RED_CARD){
					squareClass = "move move--red";
				} else {
					squareClass = "move move--mini";
				}
				
				break;
			default:
				console.log('Mini square switch bug!');
		}

	return(
		<div 
			className={squareClass}
		/>
	);
}

MiniSquare.propTypes = {
	location: PropTypes.number,
	squareType: PropTypes.number
}

export default MiniSquare;