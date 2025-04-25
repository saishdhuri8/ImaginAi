import axios from 'axios'


const userApi = axios.create({
    baseURL: "https://imagin-ai-4lk2.vercel.app"
})


export const createUserAtServer=async(userData)=>{
  
    
    try {
        const response=await userApi.post("/adduser",userData)
        return response.status
    } catch (error) {
        console.log(error)
        return 400
    }
}

export const getUserDetailsFromDb=async(userId)=>{
    try {
        const res=await userApi.post("/getuser",{userId:userId})
        const{name ,profilePic,rootFolderId}=res.data
        return {name:name,profilePic:profilePic,rootFolderId:rootFolderId}
    } catch (error) {
        console.log(error);
        return false
    }
}

export const getFolderContents=async(userId,folderId)=>{
    try {
        const res=await userApi.post("/getfolderdetails",{userId:userId,folderId:folderId})
        return res.data
    } catch (error) {
        return false
    }
}

export const addFolder=async(userId,parenId,name)=>{
    try {
        const res=await userApi.post("/addfolder",{userId:userId,parentId:parenId,name:name})
        return res.data
    } catch (error) {
        return false
    }
}

export const uploadImage=async(data)=>{
    try {
        const res=await userApi.post("/addimage",data)
        return res.data.url
    } catch (error) {
        return false
    }
}

export const deleteImage=async(data)=>{
    try {
        const res=await userApi.post("/deleteimage",data);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
