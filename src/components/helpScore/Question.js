import React from 'react';

const Question = ({ question }) => {
    const { id, description, ...options } = question;

    return (
        <div style={{ marginBottom: '20px' }}>
            <p><strong>ID:</strong> {id}</p>
            {description && <p><strong>Description:</strong> {description}</p>}
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
