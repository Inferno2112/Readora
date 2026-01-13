import { useEffect, useState } from 'react'
import './App.css'
import { Header, Footer } from './components'
import {login,logout} from './store/authSlice'
import{useDispatch} from 'react-redux'
import authService from './appwrite/auth'

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getAccount()
    .then((userData)=>{
      if(userData){
        dispatch(login({userData}))
      }else{
        dispatch(logout())
      } 
    })
    .finally(() => setLoading(false));
  }, []);

  return !loading ? (
  <>
    <Header />
    <main>
      {/* Your main app content goes here */}
    </main>
    <Footer />
  </>
  ) : (null);
}

export default App
