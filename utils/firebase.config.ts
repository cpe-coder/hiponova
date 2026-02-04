// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyAWuCdsgwtT3YtnyUcioHb6WD_piNqT2Wk",
	authDomain: "hiponova-c657a.firebaseapp.com",
	databaseURL: "https://hiponova-c657a-default-rtdb.firebaseio.com",
	projectId: "hiponova-c657a",
	storageBucket: "hiponova-c657a.firebasestorage.app",
	messagingSenderId: "174816674498",
	appId: "1:174816674498:web:1fb6d59544647ebbd2715b",
	measurementId: "G-FP0LXHBRM1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
