// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyC7NCL_wPeW7p-7TfDA25vaK56N1W8uLjg",
	authDomain: "hiponova-77ae7.firebaseapp.com",
	databaseURL: "https://hiponova-77ae7-default-rtdb.firebaseio.com",
	projectId: "hiponova-77ae7",
	storageBucket: "hiponova-77ae7.firebasestorage.app",
	messagingSenderId: "424440679687",
	appId: "1:424440679687:web:c279aaa6d4011f029289a2",
	measurementId: "G-077L6ZEHB2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
