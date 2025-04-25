import { app } from "../firebaseConfig.js";
import { getFirestore, collection, addDoc, query, setDoc, doc, getDoc, updateDoc, where, getDocs, arrayUnion,arrayRemove } from "firebase/firestore";

const db = getFirestore(app);

export const addUserToDataBase = async (user) => {
    const { userId, name, email, profilePic } = user;
    try {
        const userRef = doc(db, "users", userId);

       
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          
            return true;  
        }


        await setDoc(userRef, {
            name: name || "noName",
            email: email,
            profilePic: profilePic || "",
            rootFolderId: ""
        });


        const col = collection(userRef, "folders");
        const rootFolderRef = await addDoc(col, {
            name: "root",
            parent: "",
            pictures: []
        });


        await updateDoc(userRef, {
            rootFolderId: rootFolderRef.id
        });

        return true;
    } catch (error) {
        console.error("Error adding user to database:", error);
        return false;
    }
};

export const getFirebaseUser = async (userId) => {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);


        if (userSnap.exists()) {
            return { name: userSnap.data().name, profilePic: userSnap.data().profilePic, rootFolderId: userSnap.data().rootFolderId }
        } else {
            console.log("No such document!");
            return false;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return false;
    }
}

export const addFolderAtFirebase = async (userId, parentId, name) => {
    try {
        const colref = collection(db, "users", userId, "folders")
        const res = await addDoc(colref, {
            name: name,
            parent: parentId,
            pictures: []
        })
        return { id: res.id, name: name }
    } catch (error) {
        console.log(error);
        return false
    }
}


export const getFolderDetailsFromFirebase = async (userId, folderId) => {
    try {
        const final = {};


        const docRef = doc(db, "users", userId, "folders", folderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            final.images = docSnap.data().pictures;
            final.name = docSnap.data().name;
        } else {
            return false;
        }


        const colRef = collection(db, "users", userId, "folders");
        const q = query(colRef, where("parent", "==", folderId));
        const querySnapshot = await getDocs(q);


        final.subFolders = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name,
        }));



        return final;
    } catch (error) {
        console.error("Error fetching folder details:", error);
        return false;
    }
};

export const addImageAtFirebase = async (userId, folderId, imgURL) => {
    try {
        const docRef = doc(db, "users", userId, "folders", folderId);
        await updateDoc(docRef, {
            pictures: arrayUnion(imgURL)
        });
        return true;
    } catch (error) {
        console.error("Error adding image:", error);
        return false;
    }
};

export const deleteImageAtFirebase = async (data) => {
    const { userId, imageURL, folderId } = data;

    try {
        const docRef = doc(db, "users", userId, "folders", folderId);
        await updateDoc(docRef, {
            pictures: arrayRemove(imageURL)
        });

        return true;
    } catch (error) {
        console.error("Error removing image URL from Firestore:", error);
        return false;
    }
};



