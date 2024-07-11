import React from 'react';
import CountUp from 'react-countup';
import useStatistics from '../../hooks/useStatistics';
import './AnalyticsSection.css';

const AnalyticsSection = ({ animate }) => {
  const { statistics, loading, error } = useStatistics();

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  // Sort statistics by value
  const sortedStatistics = statistics
    ? Object.entries(statistics).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <section id="analytics" className="analytics-section">
      <div className="analytics-text">
        <h2>נתונים של העמותה</h2>
      </div>
      <div className="analytics-numbers">
        {sortedStatistics.map(([key, value]) => (
          key !== 'id' && (
            <div key={key} className="analytics-number">
              {animate && (
                <CountUp
                  start={0}
                  end={Number(value) || 0}
                  duration={3}
                  separator=","
                  className="countup-number"
                />
              )}
              <h3>{key}</h3>
            </div>
          )
        ))}
      </div>
    </section>
  );
};

export default AnalyticsSection;
