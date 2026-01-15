import { useEffect, useState } from 'react'
import './App.css'
import { Header, Footer, AuthLayout } from './components'
import { login, logout } from './store/authSlice'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AllPosts from './pages/AllPosts'
import AddPost from './pages/AddPost'
import EditPost from './pages/EditPost'

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getAccount()
      .then((userData) => {
        if (userData) {
          dispatch(login({ userData }))
        } else {
          dispatch(logout())
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return !loading ? (
    <Router>
      <Routes>
        {/* Public routes - only for unauthenticated users */}
        <Route path="/login" element={
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        } />
        <Route path="/signup" element={
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        } />

        {/* Protected routes - only for authenticated users */}
        <Route path="/" element={
          <AuthLayout authentication>
            <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
              <div className='w-full block'>
                <Header />
                <main>
                  <AllPosts />
                </main>
                <Footer />
              </div>
            </div>
          </AuthLayout>
        } />
        <Route path="/add-post" element={
          <AuthLayout authentication>
            <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
              <div className='w-full block'>
                <Header />
                <main>
                  <AddPost />
                </main>
                <Footer />
              </div>
            </div>
          </AuthLayout>
        } />
        <Route path="/edit-post/:slug" element={
          <AuthLayout authentication>
            <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
              <div className='w-full block'>
                <Header />
                <main>
                  <EditPost />
                </main>
                <Footer />
              </div>
            </div>
          </AuthLayout>
        } />
      </Routes>
    </Router>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gray-400">
      <h1 className="text-xl">Loading...</h1>
    </div>
  );
}

export default App
