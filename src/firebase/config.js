import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

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
const app = initializeApp(firebaseConfig)

// Init firebase
const db = getFirestore()

// Init Firebase auth
const auth = getAuth()

const storage = getStorage(app)

export { db, auth, storage }
