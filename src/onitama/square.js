import React from 'react';
import PropTypes from 'prop-types';
import './onitama.css';

import img_blueOmnyo from './images/blueOmnyo.png'
import img_redOmnyo from './images/redOmnyo.png'
import img_bluePuppet from './images/bluePuppet.png'
import img_redPuppet from './images/redPuppet.png'
import img_block from './images/block.png'
import img_bluePunch from './images/bluePunch.png'
import img_redPunch from './images/redPunch.png'

function Square(props) {
	const IMAGE_DIMENSIONS = 64;

	const EMPTY_SPACE = props.pieceType.EMPTY_SPACE,
	      BLUE_PUPPET = props.pieceType.BLUE_PUPPET,
	      BLUE_ONMYO = props.pieceType.BLUE_ONMYO,
	      RED_PUPPET = props.pieceType.RED_PUPPET,
	      RED_ONMYO = props.pieceType.RED_ONMYO;

	let className = "square";
	const BLUE_SHRINE_LOCATION = 10,
	      RED_SHRINE_LOCATION = 14;
	if(props.location === BLUE_SHRINE_LOCATION || 
		 props.location === RED_SHRINE_LOCATION) {
		className = "square square--shintoShrine";
	}

	function getHighlightIcon(colour, isBlueTurn, isHighlighted) {
		if(!isHighlighted) return null;
		const isRedSpace = (colour === RED_PUPPET) || (colour === RED_ONMYO),
		      isBlueSpace = !isRedSpace && (colour !== EMPTY_SPACE),
		      isAllySpace = (isBlueSpace && isBlueTurn) || (isRedSpace && !isBlueTurn),
		      redIsEnemy = isRedSpace && isBlueTurn,
		      blueIsEnemy = isBlueSpace && !isBlueTurn;

		if(isAllySpace){
			return <img 
				src={img_block} 
				className="square__imgOverlappingIcon"
				alt="Cannot move onto ally space."
				draggable="false"
				height={IMAGE_DIMENSIONS}
				width={IMAGE_DIMENSIONS}
			/>;
		} else if (redIsEnemy) {
			return <img 
				src={img_bluePunch} 
				className="square__imgOverlappingIcon"
				alt="Remove this enemy by selecting this space."
				draggable="false"
				height={IMAGE_DIMENSIONS}
				width={IMAGE_DIMENSIONS}
			/>;
		} else if (blueIsEnemy) {
			return <img 
				src={img_redPunch} 
				className="square__imgOverlappingIcon" 
				alt="Remove this enemy by selecting this space."
				draggable="false"
				height={IMAGE_DIMENSIONS}
				width={IMAGE_DIMENSIONS}
			/>;
		} else {
			return null;
		}
	}

	function getIcon(pieceType) {
		switch(pieceType){
		case(EMPTY_SPACE):
			return null; 
		case(BLUE_PUPPET):
			return <img 
				src={img_bluePuppet}
				onMouseOver={() => props.onMouseOver(props.location)}
				onMouseOut={() => props.onMouseOut(props.location)} 
				height={IMAGE_DIMENSIONS} 
				width={IMAGE_DIMENSIONS}
				className="square__imgPiece"
				draggable="false"
				alt="Blue puppet"
			/>;
		case(BLUE_ONMYO):
			return <img 
				src={img_blueOmnyo}
				onMouseOver={() => props.onMouseOver(props.location)}
				onMouseOut={() => props.onMouseOut(props.location)} 
				height={IMAGE_DIMENSIONS} 
				width={IMAGE_DIMENSIONS}
				className="square__imgPiece"
				draggable="false"
				alt="Blue omnyo"
			/>;
		case(RED_PUPPET):
			return <img 
				src={img_redPuppet}
				onMouseOver={() => props.onMouseOver(props.location)}
				onMouseOut={() => props.onMouseOut(props.location)} 
				height={IMAGE_DIMENSIONS} 
				width={IMAGE_DIMENSIONS}
				className="square__imgPiece"
				draggable="false"
				alt="Red puppet"
			/>;
		case(RED_ONMYO):
			return <img 
				src={img_redOmnyo}
				onMouseOver={() => props.onMouseOver(props.location)}
				onMouseOut={() => props.onMouseOut(props.location)} 
				height={IMAGE_DIMENSIONS} 
				width={IMAGE_DIMENSIONS}
				className="square__imgPiece"
				draggable="false"
				alt="Red omnyo"
			/>;
		default:
			console.log('Switch didn\'t work, pieceType: ' + pieceType);
			return null;
		}
	}

		let squareModifier;
	if(props.isHighlighted){
		if(props.isKeyboardSelected){
			squareModifier = "square--highlighted square--keyboardSelected";
		} else {
			squareModifier = "square--highlighted";
		}
	} else if(props.isSelected) {
		squareModifier = "square--selected";
	} else if(props.isKeyboardSelected){
		squareModifier = "square--keyboardSelected";
	}

	return (
		<button 
			className={className + " " + squareModifier}
			onMouseOver={() => props.onMouseOver(props.location)}
			onMouseOut={() => props.onMouseOut(props.location)} 
			style={{backgroundSize: IMAGE_DIMENSIONS+"px "+IMAGE_DIMENSIONS+"px"}}
			onClick={props.onClick}
		>
				{getIcon(props.colour)}
				{getHighlightIcon(props.colour, props.isBlueTurn, props.isHighlighted)}
		</button>
	);
}

Square.propTypes = {
	colour: PropTypes.number,
	isBlueTurn: PropTypes.bool,
	isHighlighted: PropTypes.bool,
	isKeyboardSelected: PropTypes.bool,
	isSelected: PropTypes.bool,
	location: PropTypes.number,
	onClick: PropTypes.func,
	onMouseOut: PropTypes.func,
	onMouseOver: PropTypes.func,
	pieceType: PropTypes.object
}

export default Square;
