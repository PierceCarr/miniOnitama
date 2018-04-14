import React from 'react';
import PropTypes from 'prop-types';
import Square from './square.js';
import './onitama.css';

function Board(props) {

	function renderSquare(location, selectedPiece, highlightedSpaces, keyboardSelected) {
		let isSelected = false;
		if(location === selectedPiece){
			isSelected = true;
		}

		const isHighlighted = highlightedSpaces[location],
		      isKeyboardSelected = location === keyboardSelected;

		const key = props.keyGen();
		return(
			<Square 
				colour={props.pieces[location]}
				isBlueTurn={props.isBlueTurn}
				isHighlighted={isHighlighted}
				isKeyboardSelected={isKeyboardSelected}
				isSelected={isSelected}
				key={key}
				location={location}
				onClick={() => props.onClick(location, selectedPiece)}
				onMouseOut={() => props.onMouseOut(location)}
				onMouseOver={() => props.onMouseOver(location)}
				pieceType={props.pieceType}
			/>
		);
	}

	const NUMBER_OF_ROWS = 5,
	      ROW_WIDTH = {width: '340px'};
	const rows = [];
	let spaceCount = 0;
	
	//Generates 5 rows
	for(let rowCount = 0; rowCount < NUMBER_OF_ROWS; rowCount++) {
		let tempRow = [];

		//Generates 5 squares for each row
		for(let i = 0; i < NUMBER_OF_ROWS; i++, spaceCount++){
			tempRow.push(renderSquare(spaceCount, props.selected, 
									  props.highlightedSpaces, 
									  props.keyboardSelectedSpace));
		}
		const key = props.keyGen();
		rows.push(
			<div 
				className="board-row" 
				style={ROW_WIDTH}
				key={key}>{tempRow}
			</div>
		);
	}

	return(
		<div>
			{rows}
		</div>
	);
}

Board.propTypes = {
	highlightedSpaces: PropTypes.array,
	isBlueTurn: PropTypes.bool,
	keyGen: PropTypes.func,
	keyboardSelectedSpace: PropTypes.number,
	movesToDisplay: PropTypes.array,
	onClick: PropTypes.func,
	onMouseOut: PropTypes.func,
	onMouseOver: PropTypes.func,
	pieces: PropTypes.array,
	pieceType: PropTypes.object,
	selected: PropTypes.number,
	selectedSpirit: PropTypes.number
}

export default Board;