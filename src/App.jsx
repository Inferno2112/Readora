import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Header, Footer, AuthLayout,AppLayout } from "./components";
import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllPosts from "./pages/AllPosts";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getAccount()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthLayout authentication={false}>
              <Signup />
            </AuthLayout>
          }
        />

        {/* Protected */}
        <Route
          path="/"
          element={
            <AuthLayout authentication>
              <AppLayout>
                <AllPosts />
              </AppLayout>
            </AuthLayout>
          }
        />

        <Route
          path="/add-post"
          element={
            <AuthLayout authentication>
              <AppLayout>
                <AddPost />
              </AppLayout>
            </AuthLayout>
          }
        />

        <Route
          path="/edit-post/:slug"
          element={
            <AuthLayout authentication>
              <AppLayout>
                <EditPost />
              </AppLayout>
            </AuthLayout>
          }
        />

        <Route
          path="/all-posts"
          element={
            <AuthLayout authentication>
              <AppLayout>
                <AllPosts />
              </AppLayout>
            </AuthLayout>
          }
        />

        <Route
          path="/post/:slug"
          element={
            <AuthLayout authentication>
              <AppLayout>
                <Post />
              </AppLayout>
            </AuthLayout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
