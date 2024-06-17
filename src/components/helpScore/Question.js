import React from 'react';

const Question = ({ question }) => {
    const { id, Description, ...options } = question;

    return (
        <div style={{ marginBottom: '20px' }}>
            <p><strong>ID:</strong> {id}</p>
            <p><strong>Description:</strong> {Description}</p>
            <ul>
                {Object.keys(options).map((key) => (
                    <li key={key}>
                        <strong>{key}</strong>: {options[key]}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Question;