import { Router } from "express";
import upload from '../multer.js'
import { addUserToDataBase, getFirebaseUser, addFolderAtFirebase, getFolderDetailsFromFirebase, addImageAtFirebase, deleteImageAtFirebase } from "../Utils/firebase.database.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../Utils/cloudinary.upload.js";

const userRoute = Router()

userRoute.post("/adduser", async (req, res) => {
    const response = await addUserToDataBase(req.body)
    if (response) return res.status(200)
    else return res.status(500)
})


userRoute.post("/getuser", async (req, res) => {
    const response = await getFirebaseUser(req.body?.userId)
    if (response) return res.status(200).json({ name: response.name, profilePic: response.profilePic, rootFolderId: response.rootFolderId })
    else return res.status(500).json({ message: "Something went wrong" })
})

userRoute.post("/addfolder", async (req, res) => {
    const { userId, parentId, name } = req.body;
    const response = await addFolderAtFirebase(userId, parentId, name)
    if (response) {
        return res.status(200).json(response)
    }
    else {
        return res.status(500).json({ message: "server error" })
    }
})

userRoute.post("/getfolderdetails", async (req, res) => {
    const { userId, folderId } = req.body
    const response = await getFolderDetailsFromFirebase(userId, folderId)

    if (response) return res.status(200).json(response);
    else return res.status(500).json({ message: "internal server error" })
})

userRoute.post("/addimage", upload.single("image"), async (req, res) => {
    const { userId, folderId } = req.body
    const path = req.file.path
    const uploadResult = await uploadToCloudinary(path)

    if (uploadResult) {
        const response = await addImageAtFirebase(userId, folderId, `${uploadResult.url}`)
        if (response) return res.status(200).json({ url: uploadResult.url })
        else return res.status(500).json({ message: "internal server error" })
    }
    else return res.status(500).json({ message: "inter server error" })
})

userRoute.post("/deleteimage", async (req, res) => {
    const { userId, imageURL, folderId } = req.body;

    if (!userId || !imageURL || !folderId) {
        return res.status(400).json({ message: "Invalid parameters" });
    }

    try {
        const firebaseResult = await deleteImageAtFirebase({ userId, imageURL, folderId });
        if (!firebaseResult) {
            return res.status(400).json({ message: "Firebase fucked" });
        }

        const seperatedURL = imageURL.split('/');
        const filenameWithExt = seperatedURL[seperatedURL.length - 1]; 
        const finalURL = filenameWithExt.split('.')[0]; 
        
        const cloudinaryResponse = await deleteFromCloudinary(finalURL);
        
        if (!cloudinaryResponse) {
            return res.status(400).json({ message: "Cloudinary fucked" });
        }
        

        return res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "server hag diya" });
    }
});




export default userRoute