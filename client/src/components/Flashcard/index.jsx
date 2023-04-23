import styles from "./index.module.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-solid-svg-icons'

export default function Flashcard({f, getColours, handleFlip, handleFavorites, flippedCards, favourites}) {

  async function destroyFlashcard(e, cardId) {
    e.stopPropagation();
    const options = {
      method: "DELETE"
    };

    const res = await fetch(`https://learnify-6tx5.onrender.com/flashcards/${cardId}`, options);
      
    if (res.ok) {
      getData()
    } else {
      console.log("Card failed to delete.");
    }
  }

  return (
    <div
      key={f.card_id}
      onClick={() => handleFlip(f.card_id)}
      className={styles["flashcard-card"]}
      style={{
        transform: flippedCards.includes(f.card_id)
          ? "rotateY(180deg)"
          : "none",
        background: getColours(f.collection).primary,
        border: `6.5px solid ${getColours(f.collection).secondary}`,
      }}
    >
      <button
        style={{
          color: favourites.includes(f.card_id)
            ? getColours(f.collection).secondary
            : getColours(f.collection).primary,
        }}
        className={`${styles["favoriteBtn"]}`}
        onClick={(e) => handleFavorites(e, f.card_id)}
      >
        ★
      </button>
      <div className={styles["front"]}>
        <h1 className={styles["flashcard-title"]}>{f.collection}</h1>
        <h2 className={styles["flashcard-question"]}>{f.question}</h2>
        <button className={styles["delete-btn"]} onClick={destroyFlashcard}><FontAwesomeIcon icon={faTrashCan} /></button>
      </div>
      <div className={styles["back"]}>
        <h2 className={styles["flashcard-answer"]}>{f.fact}</h2>
      </div>
    </div>
  );
}
