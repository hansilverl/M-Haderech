import React, { useState } from 'react';
import './HelpQuestionnaire.css';

const HelpScore = () => {
  const [score, setScore] = useState({
    nausea: 0,
    vomiting: 0,
    retching: 0,
  });
  const [totalScore, setTotalScore] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScore({
      ...score,
      [name]: parseInt(value),
    });
  };

  const calculateScore = () => {
    const total = score.nausea + score.vomiting + score.retching;
    setTotalScore(total);
  };

  return (
    <div className="help-score-container">
      <h1>HELP Score Calculator</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          calculateScore();
        }}
      >
        <div className="form-group">
          <label htmlFor="nausea">Nausea:</label>
          <input
            type="number"
            id="nausea"
            name="nausea"
            value={score.nausea}
            onChange={handleChange}
            min="0"
            max="10"
          />
        </div>
        <div className="form-group">
          <label htmlFor="vomiting">Vomiting:</label>
          <input
            type="number"
            id="vomiting"
            name="vomiting"
            value={score.vomiting}
            onChange={handleChange}
            min="0"
            max="10"
          />
        </div>
        <div className="form-group">
          <label htmlFor="retching">Retching:</label>
          <input
            type="number"
            id="retching"
            name="retching"
            value={score.retching}
            onChange={handleChange}
            min="0"
            max="10"
          />
        </div>
        <button type="submit">Calculate HELP Score</button>
      </form>
      {totalScore > 0 && (
        <div className="score-result">
          <h2>Total HELP Score: {totalScore}</h2>
        </div>
      )}
    </div>
  );
};

export default HelpScore;
