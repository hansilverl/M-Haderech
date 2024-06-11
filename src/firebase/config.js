import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'


// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAZkX5HU4sgGaVEQM3IHEWLDH-8s1zw6EY',
	authDomain: 'm-haderech.firebaseapp.com',
	projectId: 'm-haderech',
	storageBucket: 'm-haderech.appspot.com',
	messagingSenderId: '198874792126',
	appId: '1:198874792126:web:b036870bcd71db47a8deef',
}

// Initialize Firebase
initializeApp(firebaseConfig)

// Init firebase
const db = getFirestore()

// Init Firebase auth
const auth = getAuth()

export { db, auth }