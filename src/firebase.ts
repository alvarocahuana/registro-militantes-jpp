import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración real de Firebase (Proyecto JPP Militantes Puno)
const firebaseConfig = {
    apiKey: "AIzaSyAzD_KzY1DQ_WfqT-CKJCGnmmhq-zs2ILg",
    authDomain: "jppmilitantespuno.firebaseapp.com",
    projectId: "jppmilitantespuno",
    storageBucket: "jppmilitantespuno.firebasestorage.app",
    messagingSenderId: "331965138424",
    appId: "1:331965138424:web:f42f123ff048318316c20d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);
