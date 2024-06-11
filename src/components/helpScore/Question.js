// src/components/helpScore/question.js
import React from 'react'

const Question = ({ question }) => {
    // extract id and description from question object
    // ... - Collect the remaining properties of `question` into an object called `options`.
    const { id, q, ...options } = question
    /* we will return "Description", and a vertical table with the options */
    return (
        <div>
            <h3>{q}</h3>
            <table>
                <tbody>
                    {Object.keys(options).map((option) => (
                        <tr key={option}>
                            <td>{option}</td>
                            <td>{options[option]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )

}



export default Question
