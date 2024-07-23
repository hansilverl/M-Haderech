import './AnalyticsSection.css'

import React from 'react'
import CountUp from 'react-countup'
import useStatistics from '../../hooks/useStatistics'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'

const AnalyticsSection = ({ animate }) => {
	const { statistics, loading, error } = useStatistics()
	// Sort statistics by value
	const sortedStatistics = statistics ? Object.entries(statistics).sort((a, b) => b[1] - a[1]) : []

	return (
		<section id='analytics' className='analytics-section'>
			{loading && <LoadingSpinner />}
			{error && <p>שגיאה: {error}</p>}
			{!loading && !error && (
				<>
					<div className='analytics-text'>
						<h2>נתוני העמותה</h2>
					</div>
					<div className='analytics-numbers'>
						{sortedStatistics.map(
							([key, value]) =>
								key !== 'id' && (
									<div key={key} className='analytics-number'>
										{animate && (
											<CountUp
												start={0}
												end={Number(value) || 0}
												duration={3}
												separator=','
												className='countup-number'
											/>
										)}
										<h3>{key}</h3>
									</div>
								)
						)}
					</div>
				</>
			)}
		</section>
	)
}

export default AnalyticsSection
