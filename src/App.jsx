import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
	const [deck, setDeck] = useState(null);
	const [card, setCard] = useState(null);
	const [isShuffling, setIsShuffling] = useState(false);
	const deckId = useRef(null);

	// fetch new deck
	useEffect(() => {
		async function fetchDeck() {
			try {
				const res = await axios.get(
					"https://deckofcardsapi.com/api/deck/new/shuffle/"
				);
				setDeck(res.data);
				deckId.current = res.data.deck_id;
			} catch (e) {
				console.error("Error fetching new deck:", e);
			}
		}

		fetchDeck();
	}, []);

	// Function to draw a card
	const drawCard = async () => {
		if (!deckId.current) return;
		try {
			const res = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckId.current}/draw/`
			);
			if (res.data.remaining === 0) {
				alert("Error: no cards remaining!");
			} else {
				setCard(res.data.cards[0]);
			}
		} catch (e) {
			console.error("Error drawing card:", e);
		}
	};

	// Function to shuffle the exissting deck
	const shuffleDeck = async () => {
		if (!deckId.current) return;
		// disable button while shuffling
		setIsShuffling(true);
		try {
			const res = await axios.get(
				`https://deckofcardsapi.com/api/deck/${deckId.current}/shuffle/`
			);
			setDeck(res.data);
			setCard(null);
		} catch (e) {
			console.error("Error shuffling deck:", e);
		} finally {
			setIsShuffling(false);
		}
	};

	return (
		<>
			{card ? (
				<div>
					<img
						src={card.image}
						alt={`${card.value}" of ${card.suit}`}
					/>
				</div>
			) : (
				<p>No card drawn yet.</p>
			)}
			<button onClick={drawCard} disabled={isShuffling}>
				Draw Card
			</button>
			<button onClick={shuffleDeck} disabled={isShuffling}>
				{isShuffling ? "Shuffling..." : "Shuffle Deck"}
			</button>
		</>
	);
};

export default App;
