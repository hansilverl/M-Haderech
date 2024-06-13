// src/components/helpScore/question.js
import React from 'react'


const Question = ({ question }) => {
    // extract id and description from question object
    // ... - Collect the remaining properties of `question` into an object called `options`.
    const { id, q, ...options } = question
    /* we will return "Description", and a vertical table with the options */
    return (
        <div className="q_container">
            <p id={`question-${id}`}>{q}</p>            
            <table className="q_table">
                <thead>
                    <tr>
                        {/* the top row is the value of the options */}
                        {Object.keys(options).map((option) => (
                            <th>
                                {options[option]}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/*radio button for each option*/}
                    <tr>
                        {Object.keys(options).map((option) => (
                            <td>
                                <input type="radio" name={id} value={option} />
                            </td>
                        ))}
                    </tr>

                </tbody>

            </table>
        </div>
    )

}



export default Question
