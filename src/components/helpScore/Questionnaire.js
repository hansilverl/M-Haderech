// src/components/helpScore/Questionnaire.js

import React, { useState } from 'react';
import Question from './Question';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import './calculateHelpScore.css'; // Import the CSS file

const questions = [
  {
    question: "My nausea level most of the time:",
    options: ["None", "Mild", "Moderate", "4", "Severe"]
  },
  {
    question: "I average __ vomiting episodes/day:",
    options: ["0", "1-2", "3-5", "6-8", "9-12", "13 or more"]
  },
  // Add more questions here
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'responses'), answers);
      alert('Response submitted successfully!');
    } catch (error) {
      console.error('Error submitting response: ', error);
      alert('Failed to submit response.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {questions.map((q, index) => (
        <Question
          key={index}
          question={q.question}
          options={q.options}
          onChange={handleChange}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default Questionnaire;
