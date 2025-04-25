import { useEffect, useState } from "react"
import { Route, Routes } from 'react-router'
import UserLayout from "./layouts/UserLayout"
import Home from "./components/Home"
import TextToImage from "./components/TextToImage"
import PromptToEdit from "./components/PromptToEdit"
import Landing from './components/Landing'
import Signup from './components/Auth/Signup'
import Login from './components/Auth/Login'
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./Firebase"
import { useNavigate } from "react-router"
import { updateUser } from "./redux/userSlice"
import { useDispatch } from 'react-redux'
import { getUserDetailsFromDb } from "./API/user.api"

function App() {
  const [isauth, setIsAuth] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        
        
        setTimeout(async () => {
          const res = await getUserDetailsFromDb(user.uid);
          
          if (res) {
            setIsAuth(true);
            dispatch(updateUser({ userId: user.uid, name: res.name, profilePic: res.profilePic, rootFolderId: res.rootFolderId }));
            if (res.rootFolderId) {
              navigate(`/user/home/${res.rootFolderId}`);
            }
          }
        }, 900);
      } else {
        setIsAuth(false);
      }
    });
  }, []);



  if (isauth) {
    return (
      <>
        <Routes>
          <Route path="/user" element={<UserLayout />}>
            <Route path="/user/home/:parent" element={<Home />} />
            <Route path="/user/text-to-image" element={<TextToImage />} />
            <Route path="/user/prompt-to-edit" element={<PromptToEdit />} />
          </Route>
        </Routes>
      </>
    )
  }
  else {

    return (

      <>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </>
    )

  }

}

export default App
