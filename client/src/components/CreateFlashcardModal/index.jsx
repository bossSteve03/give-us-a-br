import React, { useState } from "react";
import styles from "./index.module.css";

export default function CreateFlashcardModal({ showModal, setShowModal, getData, primary, secondary }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [subject, setSubject] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");


  function handleFlip() {
    setIsFlipped(!isFlipped);
  }

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleInputClick = (e) => {
    e.stopPropagation();
  };

  const openCloseModal = (e) => {
    e.stopPropagation()
    setShowModal(!showModal);
    setIsFlipped(false);
  };

  async function createFlashcard() {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collection: subject, question: question, fact: answer, user_id: localStorage.getItem("user_id") })
      };
    
      const res = await fetch(`https://learnify-6tx5.onrender.com/flashcards/`, options);
      
      if (res.ok) {
        setAnswer("")
        setSubject("")
        setQuestion("")
        getData()
      } else {
        console.log("Something failed, very sad! :(");
      }
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsFlipped(false);
    
    if (question && subject && answer) {
      createFlashcard();
      setShowModal(false);
      e.target.reset()
    } else {
      
      setError("Can't leave field(s) blank");
    }
  };

  return (
    <div
      className={styles["overlay"]}
      style={{ display: showModal ? "flex" : "none" }}
    >
      <form onSubmit={handleFormSubmit} role='form'>
        <div className={styles["create-flashcard"]} style={{ transform: isFlipped ? "rotateY(180deg)" : "none", background: primary, border: `7px solid ${secondary}`  }} onClick={handleFlip}>
          <div className={styles["front"]}>
            <h1 className={styles["title"]}>Create flashcard</h1>
            <select value={subject} onChange={handleSubjectChange} onClick={handleInputClick} name="subjects" role='subject'>
              <option disabled value="">
                Select a subject
              </option>
              <option value="Geography">Geography</option>
              <option value="History">History</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="English">English</option>
              <option value="Sports">Sports</option>
              <option value="Religious-Education">Religious Education</option>
            </select>
            <input className={styles["flashcard-question"]} type="text" name="question" placeholder="Question" onChange={handleQuestionChange} onClick={handleInputClick}/>
            <div className={styles["options"]}>
              <button onClick={openCloseModal} className={styles["cancel"]}>Cancel</button>
              <button type="submit" className={styles["submit"]} role='submit'>Submit</button>
            </div>
            {error && <p className={styles["error-message"]}>{error}</p>}

          </div>
          <div className={styles["back"]}>
            <input className={styles["flashcard-answer"]} type="text" name="answer" placeholder="Answer" onChange={handleAnswerChange} onClick={handleInputClick}/>
            <div className={styles["options"]}>
              <button onClick={openCloseModal} className={styles["cancel"]}>Cancel</button>
              <button type="submit" className={styles["submit"]}>Submit</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
