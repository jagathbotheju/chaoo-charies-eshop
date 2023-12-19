// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkrbjRd64hf2E2hOombfKo1nAN1U-UV_o",
  authDomain: "chaoo-eshop.firebaseapp.com",
  projectId: "chaoo-eshop",
  storageBucket: "chaoo-eshop.appspot.com",
  messagingSenderId: "846945972139",
  appId: "1:846945972139:web:91cdfc0183f851ac9c2cee",
  measurementId: "G-QW8QRW02K8",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebaseApp);
export default firebaseApp;
