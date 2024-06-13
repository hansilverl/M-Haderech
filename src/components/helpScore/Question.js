import React, { useState } from 'react';

const Question = ({ question }) => {
    const { id, q, ...options } = question;
    const [selectedOption, setSelectedOption] = useState(null);

    const handleRadioChange = (option) => {
        setSelectedOption(option);
    };

    return (
        <div className="q-container">
            {/* ${id} is used to generate unique ids for each question */}
            <p id={`question-${id}`} className="question-text">{q}</p>            
            <table className="q-table">
                <thead>
                    <tr>
                        {Object.keys(options).map((option) => (
                            <th key={option}>
                                {options[option]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {Object.keys(options).map((option) => (
                            <td
                                key={option}
                                className={selectedOption === option ? 'selected' : ''}
                            >
                                <input
                                    type="radio"
                                    name={id}
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => handleRadioChange(option)}
                                    className="radio-input"
                                />
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Question;
