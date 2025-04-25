import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userId: "",
    profilePic: "",
    name: "",
    rootFolderId:""
}

export const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        updateUser: (state, action) => {
            const { userId, profilePic, name,rootFolderId } = action.payload;
            state.userId = userId
            state.profilePic = profilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9JPYczMNuQkNzqPL_lSi9nbULgAUhaHVVAQ&s",
            state.name = name || "----"
            state.rootFolderId = rootFolderId || ""
        },
    }


})

export const { updateUser } = userSlice.actions;
export default userSlice.reducer;