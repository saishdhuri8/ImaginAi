import { createContext, useContext } from "react";
import { app } from "./firebaseConfig.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const googleProvider = new GoogleAuthProvider();
export const auth = getAuth(app)
const FireBaseContext = createContext(null)



const signinByGoogle = async() => {
    try {
        const res=await signInWithPopup(auth, googleProvider)    
        return {userId:res.user.uid,email:res.user.email,profilePic:res.user.photoURL,name:res.user.displayName}
    }catch(error){
        return false
    }

}

const signup = async(email, password) => {
    
    try {
        const res=await createUserWithEmailAndPassword(auth,email,password)
        return {userId:res.user.uid,email:res.user.email,name:"",profilePic:""}
    } catch (error) {
        console.log(error);
        return false;
    }
}

const signin = async(email, password) => {
    try {
        const res=await signInWithEmailAndPassword(auth,email,password)
    } catch (error) {
        return false
    }
}


export const FireBaseProvider = (props) => {
    
    return (
        <FireBaseContext.Provider value={{ signin, signup, signinByGoogle }}>
            {props.children}
        </FireBaseContext.Provider>
    )
}
export const useFirebase = () => {
    return useContext(FireBaseContext);
}





