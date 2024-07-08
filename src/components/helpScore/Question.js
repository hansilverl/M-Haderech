// src/components/helpScore/Question.js

import React, { useState } from 'react';

const OptionHeaders = ({ options }) => (
    <thead>
        <tr>
            {Object.keys(options).map((option) => (
                <th key={option}>
                    {options[option]}
                </th>
            ))}
        </tr>
    </thead>
);

const OptionCells = ({ options, selectedOption, handleRadioChange, name }) => (
    <tbody>
        <tr>
            {Object.keys(options).map((option) => (
                <td
                    key={option}
                    className={selectedOption === option ? 'selected' : ''}
                >
                    <label className="radio-label">
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={selectedOption === option}
                            onChange={() => handleRadioChange(option)}
                            className="radio-input"
                        />
                        <span className="custom-radio"></span>
                        <span className="option-vert">{options[option]}</span>
                    </label>
                </td>
            ))}
        </tr>
    </tbody>
);

const Question = ({ question, onRadioChange }) => {
    const { id, q, required, ...options } = question;
    const [selectedOption, setSelectedOption] = useState(null);

    const handleRadioChange = (option) => {
        setSelectedOption(option);
        onRadioChange(option);
    };

    return (
        <div className="q-container">
            <p id={`question-${id}`} className="question-text">
                {q} {required ? <span className="required">*</span> : null}
            </p>
            <table className="q-table">
                <OptionHeaders options={options} />
                <OptionCells
                    options={options}
                    selectedOption={selectedOption}
                    handleRadioChange={handleRadioChange}
                    name={id}
                />
            </table>
        </div>
    );
};

export default Question;
