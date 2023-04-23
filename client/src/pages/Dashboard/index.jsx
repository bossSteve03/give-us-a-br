import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { Flashcard } from "../../components";

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [userCreated, setUserCreated] = useState([]);

  const getColours = (category) => {
    switch (category) {
      case "Geography":
        return { primary: "#4CB731", secondary: "#2C8715" };
      case "History":
        return { primary: "#F26E6E", secondary: "#CF4B4B" };
      case "Chemistry":
        return { primary: "#368DDD", secondary: "#1D6CB5" };
      case "Biology":
        return { primary: "#D47902", secondary: "#B16610" };
      case "Physics":
        return { primary: "#F26E6E", secondary: "#CF4B4B" };
      case "Maths":
        return { primary: "#368DDD", secondary: "#1D6CB5" };
      case "English Literature":
        return { primary: "#D47902", secondary: "#B16610" };
      case "Sports Science":
        return { primary: "#E5DF46", secondary: "#D8B603" };
      case "Religious Education":
        return { primary: "#4CB731", secondary: "#2C8715" };
      default:
        console.log(category);
        break;
    }
  };

  function handleFlip(cardId) {
    if (flippedCards.includes(cardId)) {
      setFlippedCards(flippedCards.filter((id) => id !== cardId));
    } else {
      setFlippedCards([...flippedCards, cardId]);
    }
  }

  const getUser = async () => {
    const response = await fetch(
      `https://learnify-6tx5.onrender.com/users/username/${localStorage.getItem("user_id")}`
    );

    setUsername(await response.text());
  };

  const getFavoritedCards = async () => {
    const response = await fetch(
      `https://learnify-6tx5.onrender.com/flashcards/favorite/user/${localStorage.getItem(
        "user_id"
      )}`
    );

    const data = await response.json();

    setFlashcards(data);
  };

  const checkFavorites = async () => {
    const userId = localStorage.getItem("user_id");
    const response = await fetch(
      `https://learnify-6tx5.onrender.com/flashcards/favorite/user/${userId}/`
    );

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const cardIds = data.map((d) => d.card_id);
      setFavourites(cardIds);
    }
  };

  const handleFavorites = async (e, cardId) => {
    e.stopPropagation();
    const userId = localStorage.getItem("user_id");

    const response = await fetch(
      `https://learnify-6tx5.onrender.com/flashcards/favorite/user/${userId}/card/${cardId}`,
      {
        method: favourites.includes(cardId) ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: favourites.includes(cardId) ? null : JSON.stringify({ cardId }),
      }
    );

    if (response.ok) {
      if (!favourites.includes(cardId)) {
        e.target.style.color = "#3c2970";
        setFavourites([...favourites, cardId]);
      } else {
        e.target.style.color = "black";
        setFavourites(favourites.filter((fav) => fav !== cardId));
      }
      console.log(`Success`);
    } else {
      console.log("Something failed, very sad! :(");
    }
  };

  const getUserCreated = async (e) => {
    const userId = localStorage.getItem("user_id");

    const response = await fetch(
      `https://learnify-6tx5.onrender.com/flashcards/user/${userId}`
    );

    const data = await response.json();

    if (response.ok) {
      setUserCreated(data);
    } else {
      console.log("Something failed, very sad! :(");
    }
  };

  useEffect(() => {
    getUser();
    checkFavorites();
    getUserCreated();
  }, []);

  useEffect(() => {
    getFavoritedCards();
  }, [favourites]);

  return (
    <div className={styles["dashboard"]}>
      <div className={styles["container"]}>
        <h1 className={styles["title"]}>Welcome {username}</h1>
        <div className={styles["content"]}>
          <h1 className={styles["content-heading"]}>Favourited flashcards</h1>
          <div className={styles["cards"]}>
            {Array.isArray(flashcards) && flashcards.length > 0 ? (
              flashcards.map((f) => {
                return (
                  <Flashcard
                    key={f.card_id}
                    f={f}
                    getColours={getColours}
                    handleFlip={handleFlip}
                    handleFavorites={handleFavorites}
                    flippedCards={flippedCards}
                    favourites={favourites}
                  />
                );
              })
            ) : (
              <p className={styles["no-flash"]}>
                No favourited flashcards yet...
              </p>
            )}
          </div>
          <h1 className={styles["content-heading"]}>{username}'s flashcards</h1>
          <div className={styles["cards"]}>
            {Array.isArray(userCreated) && userCreated.length > 0 ? (
              userCreated.map((f) => {
                return (
                  <Flashcard
                    key={f.card_id}
                    f={f}
                    getColours={getColours}
                    handleFlip={handleFlip}
                    handleFavorites={handleFavorites}
                    flippedCards={flippedCards}
                    favourites={favourites}
                  />
                );
              })
            ) : (
              <p className={styles["no-flash"]}>No created flashcards yet...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
