// src/components/HELP/HELP.js
import React, { useState } from 'react';
import './HELP.css';

const HELP = () => {
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const questions = [
    {
      question: "My nausea level most of the time:",
      options: [
        { label: "0 (None)", value: 0 },
        { label: "1 (Mild)", value: 1 },
        { label: "2", value: 2 },
        { label: "3 (Moderate)", value: 3 },
        { label: "4", value: 4 },
        { label: "5 (Severe)", value: 5 }
      ],
      name: "nauseaLevel"
    },
    {
      question: "I average __ vomiting episodes/day:",
      options: [
        { label: "0", value: 0 },
        { label: "1-2", value: 1 },
        { label: "3-5", value: 2 },
        { label: "6-8", value: 3 },
        { label: "9-12", value: 4 },
        { label: "13 or more", value: 5 }
      ],
      name: "vomitingEpisodes"
    },
    {
      question: "I average __ retching/dry heaving episodes/day:",
      options: [
        { label: "0", value: 0 },
        { label: "1-2", value: 1 },
        { label: "3-5", value: 2 },
        { label: "6-8", value: 3 },
        { label: "9-12", value: 4 },
        { label: "13 or more", value: 5 }
      ],
      name: "retchingEpisodes"
    },
    {
      question: "I am urinating/voiding:",
      options: [
        { label: "Same", value: 0 },
        { label: "More often due to IV fluids; light color", value: 1 },
        { label: "Slightly less often, and normal color", value: 2 },
        { label: "Once every 8 hours; slightly dark yellow", value: 3 },
        { label: "Less than every 8 hours or darker", value: 4 },
        { label: "Rarely; dark, blood; foul smell", value: 5 }
      ],
      name: "urinating"
    },
    {
      question: "Nausea/vomiting severity 1 hour after meds OR after food/drink if no meds:",
      options: [
        { label: "0 (None)", value: 0 },
        { label: "1 (Mild)", value: 1 },
        { label: "2", value: 2 },
        { label: "3 (Moderate)", value: 3 },
        { label: "4", value: 4 },
        { label: "5 (Severe)", value: 5 }
      ],
      name: "severityAfterMeds"
    },
    {
      question: "Average number of HOURS I’m UNABLE TO WORK adequately at my job and/or at home due to being sick has been:",
      options: [
        { label: "0", value: 0 },
        { label: "1-2 (hours are slightly less)", value: 1 },
        { label: "3-4 (can work part time)", value: 2 },
        { label: "5-7 (can only do a little work)", value: 3 },
        { label: "8-10 (can’t care for family)", value: 4 },
        { label: "11+ (can’t care for myself)", value: 5 }
      ],
      name: "hoursUnableToWork"
    },
    {
      question: "I have been coping with the nausea, vomiting and retching:",
      options: [
        { label: "Normal", value: 0 },
        { label: "Tired but mood is ok", value: 1 },
        { label: "Slightly less than normal", value: 2 },
        { label: "It’s tolerable but difficult", value: 3 },
        { label: "Struggling: moody, emotional", value: 4 },
        { label: "Poorly: irritable depressed", value: 5 }
      ],
      name: "coping"
    },
    {
      question: "Total amount I have been able to eat/drink AND keep it down: Medium water bottle/large cup = 2 cups/500mL.",
      options: [
        { label: "Same; no weight loss", value: 0 },
        { label: "Total of about 3 meals & 6+ cups fluid", value: 1 },
        { label: "Total of about 2 meals & some fluids", value: 2 },
        { label: "1 meal & few cups fluid; only fluid or only food", value: 3 },
        { label: "Very little, <1 meal/minimal fluids; or frequent IV", value: 4 },
        { label: "Nothing goes or stays down, or daily IV/TPN/NG", value: 5 }
      ],
      name: "eatingDrinking"
    },
    {
      question: "My anti-nausea/vomiting meds stay down/are tolerated:",
      options: [
        { label: "No meds", value: 0 },
        { label: "Always", value: 1 },
        { label: "Nearly Always", value: 2 },
        { label: "Sometimes", value: 3 },
        { label: "Rarely", value: 4 },
        { label: "Never/IV/SQ (subQ pump)", value: 5 }
      ],
      name: "medsTolerated"
    },
    {
      question: "My symptoms compared to last week:",
      options: [
        { label: "Great", value: 0 },
        { label: "Better", value: 1 },
        { label: "About Same", value: 2 },
        { label: "Worse", value: 3 },
        { label: "Much Worse", value: 4 },
        { label: "So Much Worse", value: 5 }
      ],
      name: "symptomsComparison"
    },
    {
      question: "Weight loss over last 7 days: ___% (Optional)",
      options: [
        { label: "0%", value: 0 },
        { label: "1%", value: 1 },
        { label: "2%", value: 2 },
        { label: "3%", value: 3 },
        { label: "4%", value: 4 },
        { label: "5%", value: 5 }
      ],
      name: "weightLoss"
    },
    {
      question: "Number of Rx’s for nausea/vomiting:",
      options: [
        { label: "0", value: 0 },
        { label: "1", value: 1 },
        { label: "2", value: 2 },
        { label: "3", value: 3 },
        { label: "4", value: 4 },
        { label: "5+", value: 5 }
      ],
      name: "numberOfMeds"
    }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers({ ...answers, [name]: parseInt(value) });
  };

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((acc, curr) => acc + curr, 0);
    setScore(totalScore);
  };

  return (
    <div className="help-container">
      <h2>HELP Score Questionnaire</h2>
      <form className="help-form" onSubmit={(e) => { e.preventDefault(); calculateScore(); }}>
        {questions.map((question, index) => (
          <div key={index} className="question-container">
            <span>{question.question}</span>
            {question.options.map((option, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name={question.name}
                  value={option.value}
                  onChange={handleChange}
                  required
                />
                {option.label}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Calculate Score</button>
      </form>
      {score !== null && <div className="score-display">Your HELP score is: {score}</div>}
    </div>
  );
};

export default HELP;
