// src/pages/Miscellaneous/Miscellaneous.js
import React from 'react';
import BankInfo from '../../components/BankInfo/BankInfo';
import Statistics from '../../components/Statistics/Statistics';
import AboutInfo from '../../components/About/AboutInfo';
import Contact from '../../components/Contact/Contact';
import DonationLink from '../../components/DonationLink/DonationLink';
import DonationNumber from '../../components/DonationNumber/DonationNumber';
import NewsletterLinkAdmin from '../AdminDashboard/NewsletterLinkAdmin';
import DonateTitleAdmin from '../AdminDashboard/DonateTitleAdmin';
import AboutFullAdmin from '../AdminDashboard/AboutFullAdmin';
import './Miscellaneous.css';

const Miscellaneous = () => {
  return (
		<div className='admin-miscellaneous-container'>
			<h1>שונות</h1>
			<div className='miscellaneous-content'>
				<div className='section'>
					<h2>פרטי בנק</h2>
					<BankInfo />
				</div>
				<div className='section'>
					<h2>סטטיסטיקות</h2>
					<Statistics />
				</div>
				<div className='section'>
					<h2>פרטי קשר</h2>
					<Contact />
				</div>
				<div className='section'>
					<h2>אודות</h2>
					<AboutInfo />
				</div>
				<div className='section'>
					<h2>קצת עלינו</h2>
					<AboutFullAdmin />
				</div>
				<div className='section'>
					<h2>קישורי תרומה</h2>
					<DonationLink />
				</div>
				<div className='section'>
					<h2>מספר תרומה</h2>
					<DonationNumber />
				</div>
				<div className='section'>
					<h2>קישור לניוזלטר</h2>
					<NewsletterLinkAdmin />
				</div>
				<div className='section'>
					<h2>כותרת ותת כותרת לעמוד תרומה</h2>
					<DonateTitleAdmin />
				</div>
			</div>
		</div>
	)
};

export default Miscellaneous;
