import React from 'react';
import PropTypes from 'prop-types';
import './onitama.css';

function SpiritCard(props) {
	
	let cssClass;
	if(props.selectedCard === props.location){ //selected
		cssClass = "spiritCard spiritCard--selected";
	} else if(props.isKeyTarget){ //Key highlighted
		cssClass = "spiritCard spiritCard--keyHighlighted";
	} else { //not selected
		cssClass = "spiritCard";
	}

	return(
		<button
			className={cssClass}
			onClick={props.onClick}
		>
			<div className='spiritCard__leftSide'>
					<div className="spiritCard__circle">
						{props.hanzi}
					</div>
					{props.engName}
			</div>
			<div className="spiritCard__rightSide">
				{props.movesToDisplay}
			</div>
		</button>
	);
}

SpiritCard.propTypes = {
	engName: PropTypes.string,
	hanzi: PropTypes.string,
	isKeyTarget: PropTypes.bool,
	location: PropTypes.number,
	moveSpace: PropTypes.array,
	movesToDisplay: PropTypes.array,
	onClick: PropTypes.func,
	selectedCard: PropTypes.number
}

export default SpiritCard;