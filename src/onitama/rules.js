import React from 'react';
import './rules.css';

function Rules(props) {

	return(
		<div className="rulesArea">
			<div className="flavour">
					<p/>
						Two onmyōdō priests are duking it out to see who will
						lead a fabled shrine known as Onitama. <p/>
						A victor will be decided by subduing the other with martial powress
						or conquoring their opponent's shrine. <p/>
						To aid them in the competition, they
						summon shikigami spirits to possess their puppet allies and themselves.
				</div>
			<div className="sectionBox sectionBox--top">
				<h2 className="sectionTitle">
					Goal
				</h2>
				<div className="boxText">
					Take the opponent's onmyo with any of your pieces OR move your onmyo onto
					your opponent's shrine. The onmyo is the unique piece out of your five, and it begins
					the game on your shrine.
					<p/>
				</div>
			</div>
			
			<div className="sectionBox">
				<h2 className="sectionTitle">
					One Simple Turn
				</h2>
				<div className="boxText">
					<ol>
						<li>
							Move your pieces in accordance to the pattern on the spirit cards.
							You have two personal spirit cards on your side of the board.
							Pick a card and pick a piece.
						</li>
						<li>
							You can move into empty spaces and opponent pieces. If you move onto an opponent piece,
							it is 'taken' from the board.
						</li>
						<li>
							The spirit card you used will be swapped with the neutral 'purple'
							card underneath the board. This means your oppenent will recieve your played card at the end of
							their turn. Be careful not to give them advantageous moves!
						</li>
					</ol>
					<p/>
					Note that the neutral spirit card's pattern rotates in the direction your pieces face when it is recieved.
					There is also a rare case that if you have no available legal moves on your
					turn - your turn is skipped.
					<p/>
				</div>
			</div>

			<div className="sectionBox">
				<h2 className="sectionTitle">
					Before starting
				</h2>
				<div className="boxText">
					Find a partner - this version of Onitama is strictly a local human vs. human affair.
					It's suggested that the player on the left use keyboard controls (configered in options)
					while the player on the right uses the mouse. 
						<p/><p/>
					Know that in every game the player who moves first is randomized. 
					Five spirit cards are also randomly selected from a pool of sixteen
					meaning every game will require a fresh strategy! 
					Turn timers are on to MAXIMIZE FUN, but can be toggled off in options
					if the pressure is too intense.
					<p/>
				</div>
			</div>
			<p/>
			<button 
				className="menuButton"
				onClick={() => props.toggleRules()} >
				{"Return to menu"}
			</button>
		</div>
	);
}

export default Rules;