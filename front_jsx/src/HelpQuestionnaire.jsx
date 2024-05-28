import React, { useState } from 'react';
import './HelpQuestionnaire.css';

const HelpQuestionnaire = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    pregnancyWeeks: '',
    todayWeight: '',
    lastWeekWeight: '',
    weightLossPercentage: '',
    previousScore: '',
    medications: {
      promethazine: false,
      bonjesta: false,
      granisetron: false,
      ondansetron: false,
      metoclopramide: false,
    },
    symptoms: Array(9).fill(0),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMedicationChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      medications: { ...formData.medications, [name]: checked },
    });
  };

  const handleSymptomChange = (index, value) => {
    const newSymptoms = [...formData.symptoms];
    newSymptoms[index] = value;
    setFormData({ ...formData, symptoms: newSymptoms });
  };

  const calculateTotalScore = () => {
    return formData.symptoms.reduce((acc, score) => acc + score, 0);
  };

  return (
    <div className="help-questionnaire">
      <h1>HELP Questionnaire</h1>
      <form>
        <div className="section">
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} />
        </div>
        <div className="section">
          <label>Age:</label>
          <input type="number" name="age" value={formData.age} onChange={handleInputChange} />
        </div>
        <div className="section">
          <label>Weeks of Pregnancy:</label>
          <input type="number" name="pregnancyWeeks" value={formData.pregnancyWeeks} onChange={handleInputChange} />
        </div>
        <div className="section">
          <label>Today's Weight:</label>
          <input type="number" name="todayWeight" value={formData.todayWeight} onChange={handleInputChange} />
        </div>
        <div className="section">
          <label>Last Week's Weight:</label>
          <input type="number" name="lastWeekWeight" value={formData.lastWeekWeight} onChange={handleInputChange} />
        </div>
        <div className="section">
          <label>Weight Loss Percentage:</label>
          <input type="number" name="weightLossPercentage" value={formData.weightLossPercentage} onChange={handleInputChange} />
        </div>
        <div className="section">
          <label>Previous Score:</label>
          <input type="number" name="previousScore" value={formData.previousScore} onChange={handleInputChange} />
        </div>
        <div className="section">
          <label>Medications:</label>
          <div>
            <input type="checkbox" name="promethazine" checked={formData.medications.promethazine} onChange={handleMedicationChange} /> Promethazine
          </div>
          <div>
            <input type="checkbox" name="bonjesta" checked={formData.medications.bonjesta} onChange={handleMedicationChange} /> Bonjesta
          </div>
          <div>
            <input type="checkbox" name="granisetron" checked={formData.medications.granisetron} onChange={handleMedicationChange} /> Granisetron
          </div>
          <div>
            <input type="checkbox" name="ondansetron" checked={formData.medications.ondansetron} onChange={handleMedicationChange} /> Ondansetron
          </div>
          <div>
            <input type="checkbox" name="metoclopramide" checked={formData.medications.metoclopramide} onChange={handleMedicationChange} /> Metoclopramide
          </div>
        </div>
        <div className="section symptoms">
          <label>Symptoms:</label>
          {formData.symptoms.map((symptom, index) => (
            <div key={index}>
              <label>Symptom {index + 1}:</label>
              <input type="number" value={symptom} onChange={(e) => handleSymptomChange(index, Number(e.target.value))} />
            </div>
          ))}
        </div>
        <div className="section">
          <label>Total Score:</label>
          <input type="number" value={calculateTotalScore()} readOnly />
        </div>
      </form>
    </div>
  );
};

export default HelpQuestionnaire;
