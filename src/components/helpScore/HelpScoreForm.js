// src/components/helpScore/HelpScoreForm.js

import React, { useState } from 'react';
import Question from './Question'; // Fix the casing of the file name
import './HelpScoreForm.css';

const questions = [
  {
    questionText: "My nausea level most of the time:",
    name: "nauseaLevel",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Mild" },
      { value: 2, label: "Moderate" },
      { value: 3, label: "4" },
      { value: 4, label: "Severe" }
    ]
  },
  {
    questionText: "I average __ vomiting episodes/day:",
    name: "vomitingEpisodes",
    options: [
      { value: 0, label: "0" },
      { value: 1, label: "1-2" },
      { value: 2, label: "3-5" },
      { value: 3, label: "6-8" },
      { value: 4, label: "9-12" },
      { value: 5, label: "13 or more" }
    ]
  },
  // Add more questions here...
];

const HelpScoreForm = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data submitted: ", formData);
    // Here, you can handle form submission (e.g., send data to Firebase)
  };

  return (
    <form className="help-score-form" onSubmit={handleSubmit}>
      {questions.map((q, index) => (
        <Question
          key={index}
          questionText={q.questionText}
          options={q.options}
          name={q.name}
          onChange={handleChange}
        />
      ))}
      <button type="submit" className="submit-button">Submit</button>
    </form>
  );
};

export default HelpScoreForm;
