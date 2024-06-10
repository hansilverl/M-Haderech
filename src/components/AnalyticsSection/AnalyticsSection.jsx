import React from 'react';
import './AnalyticsSection.css';

const AnalyticsSection = () => {
  return (
    <section id="analytics" className="analytics-section">
      <div className="analytics-text">
        <h2>נתונים של העמותה</h2>
        <p>כאן ניתן לראות את נתונים שלנו לאורך החודשים האחרונים...</p>
      </div>
      <div className="analytics-chart">
        <img src="https://juncotic.com/wp-content/uploads/2023/05/grafico-torta-basico-1.png" alt="Gráfico de Ejemplo" className="analytics-image" />
      </div>
    </section>
  );
};

export default AnalyticsSection;
