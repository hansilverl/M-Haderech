// src/components/helpScore/Question.js

import React from 'react';
import './HelpScoreForm.css'; // Corrected path to HelpScoreForm.css

const Question = ({ questionText, options, name, onChange }) => {
  return (
    <div className="question">
      <h4>{questionText}</h4>
      {options.map((option, index) => (
        <div key={index} className="option">
          <input
            type="radio"
            name={name}
            value={option.value}
            id={`${name}-${index}`}
            onChange={onChange}
          />
          <label htmlFor={`${name}-${index}`}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};

export default Question;
