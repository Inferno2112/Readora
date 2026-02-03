import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../store/authSlice'
import { Logo } from './index.js'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function Signup() {
  const navigate = useNavigate()
  const [error, setError] = useState("")
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm()
  const authStatus = useSelector((state) => state.auth.status);
  const create = async (data) => {
    setError("")
    try {
      const userData = await authService.createAccount(data)
      if (userData) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(login(userData));
        navigate("/")
      }
    } catch (error) {
      setError(error.message)
    }
  }
  const handlePrimaryCTA = () => {
    if (authStatus) {
      navigate("/add-post"); // logged in → write
    } else {
      navigate("/login"); // logged out → login
    }
  };

  const googleLogin = async () => {
    try {
      await authService.googleLogin();
    } catch (err) {
      setError("Google login failed");
    }
  };

  return (
    <>
      <div class="relative h-full w-full bg-white"><div class="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]">

      </div>
        <div className="flex-col  h-screen items-center justify-center bg-black px-4">
          <nav className="relative mx-auto mb-20 flex w-full max-w-7xl items-center justify-between px-5 py-4">
            <Link to='/'>
              <Logo />
            </Link>

            <button
              onClick={handlePrimaryCTA}
              className="hidden rounded-full bg-white px-5 py-2 text-sm font-semibold text-black hover:bg-gray-200 sm:block"
            >
              {authStatus ? "Write new post" : "Get started"}
            </button>
          </nav>
          <div className=" z-10 mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 sm:p-10">

            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <span className="inline-block w-full pl-25 opacity-90">
                <Logo width="100%" />
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-center text-2xl font-semibold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-yellow-400 hover:underline"
              >
                Sign in
              </Link>
            </p>

            {/* Error */}
            {error && (
              <p className="mt-6 text-center text-sm text-red-500">
                {error}
              </p>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(create)} className="mt-8 text-white">
              <div className="space-y-5">
                <Input
                  label="Full name"
                  placeholder="Enter your full name"
                  {...register("name", { required: true })}
                />

                <Input
                  label="Email address"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email", {
                    required: true,
                    validate: {
                      matchPatern: (value) =>
                        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be valid",
                    },
                  })}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", { required: true })}
                />

                <Button
                  type="submit"
                  className="w-full rounded-full bg-yellow-400 py-2.5 font-semibold text-black hover:bg-yellow-300 transition"
                >
                  Create account
                </Button>

              </div>
              <div className="mt-6">
            <button
              type="button"
              onClick={googleLogin}
              className="
      w-full rounded-full border border-white/10
      bg-zinc-800 py-2.5
      text-sm font-medium text-zinc-200
      hover:bg-zinc-700
      transition
      flex items-center justify-center gap-3
    "
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20.4H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.6z" />
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.2l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.4 4.3-17.7 10.7z" />
                <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.2C29.3 35.6 26.7 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.5 5C9.4 39.7 16.2 44 24 44z" />
                <path fill="#1976D2" d="M43.6 20.4H42V20H24v8h11.3c-1 2.6-2.8 4.7-4.9 6.2l6.3 5.2C39.9 36.6 44 30.9 44 24c0-1.3-.1-2.7-.4-3.6z" />
              </svg>
              Continue with Google
            </button>
          </div>
            </form>
          </div>
        </div>

      </div>

    </>


  )
}

export default Signup