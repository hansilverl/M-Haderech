import React from 'react';
import CountUp from 'react-countup';
import useStatistics from '../../hooks/useStatistics';
import './AnalyticsSection.css';

const AnalyticsSection = () => {
  const { statistics, loading, error } = useStatistics();

  if (loading) return <p>טוען...</p>;
  if (error) return <p>שגיאה: {error}</p>;

  return (
    <section id="analytics" className="analytics-section">
      <div className="analytics-text">
        <h2>נתונים של העמותה</h2>
        <p>כאן ניתן לראות את נתונים שלנו לאורך החודשים האחרונים...</p>
      </div>
      <div className="analytics-number">
        <h3>מספר אמהות שעזרנו להן</h3>
        <CountUp
          start={0}
          end={statistics.helped_mothers_amount || 0}
          duration={3}
          separator=","
          className="countup-number"
        />
      </div>
    </section>
  );
};

export default AnalyticsSection;
