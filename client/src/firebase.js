import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBesVSWy7jrf4yPWEfR6eqKnDpH28Jk7cs",
  authDomain: "lasc-rifd.firebaseapp.com",
  projectId: "lasc-rifd",
  storageBucket: "lascrfid.firebasestorage.app",
  messagingSenderId: "808299664120",
  appId: "1:808299664120:web:487e24b8e418b5d453210d",
  measurementId: "G-3094LMLLQE"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);