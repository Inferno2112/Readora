import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Header, Footer, AuthLayout, AppLayout } from "./components";
import PostFab from "./components/PostFab";
import { login, logout } from "./store/authSlice";
import authService from "./appwrite/auth";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllPosts from "./pages/AllPosts"
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import MyPosts from "./pages/MyPosts";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Bookmarks from "./pages/Bookmarks";
import Notifications from "./pages/Notifications";
import Explore from "./pages/Explore";



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
      <PostFab />
      <Routes>

        {/* Public */}


        <Route
          path="/"
          element={
            <AuthLayout authentication={false}>
              <Home />
            </AuthLayout>
          }
        />

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
          path="/my-posts"
          element={
            <AuthLayout authentication>
              <AppLayout>
                <MyPosts />
              </AppLayout>
            </AuthLayout>
          }
        />


        <Route
          path="/add-post"
          element={
            <AuthLayout authentication>
              <AddPost />
            </AuthLayout>
          }
        />

        <Route
          path="/edit-post/:slug"
          element={
            <AuthLayout authentication>
              <EditPost />
            </AuthLayout>
          }
        />

        <Route
          path="/all-posts"
          element={
            <AuthLayout authentication>
              <AllPosts />
            </AuthLayout>
          }
        />

        <Route
          path="/explore"
          element={
            <AuthLayout authentication>
              <Explore />
            </AuthLayout>
          }
        />

        <Route
          path="/bookmarks"
          element={
            <AuthLayout authentication>
              <Bookmarks />
            </AuthLayout>
          }
        />

        <Route
          path="/notifications"
          element={
            <AuthLayout authentication>
              <Notifications />
            </AuthLayout>
          }
        />

        <Route
          path="/profile/:userId"
          element={
            <AuthLayout authentication>
              <Profile />
            </AuthLayout>
          }
        />

        <Route
          path="/post/:slug"
          element={
            <AuthLayout authentication>
              <Post />
            </AuthLayout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
