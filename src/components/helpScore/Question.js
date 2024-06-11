// src/components/helpScore/question.js
import React from 'react';

const Question = ({ question }) => {
    const { id, description, ...options } = question;

    return (
        <div className="question-container">
            {description && <p><strong>Description:</strong> {description}</p>}
            <table>
                <thead>
                    <tr>
                        {Object.keys(options).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {Object.keys(options).map((key, index) => (
                            key !== 'id' && <td key={index}>{options[key]}</td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Question;
