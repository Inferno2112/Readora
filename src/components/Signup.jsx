import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import authService from "../appwrite/auth";
import { login } from "../store/authSlice";
import Input from "./Input";
import LoginScene from "./LoginScene";

const inputClass =
  "rounded-xl border-zinc-600 bg-white/5 text-white placeholder:text-zinc-500 focus:border-amber-500/50 focus:bg-white/10";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const generateUsername = (fullName) => {
    const firstName = fullName.trim().split(" ")[0];
    const cleanFirstName = firstName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const randomNumbers = Math.floor(Math.random() * 100)
      .toString()
      .padStart(2, "0");
    return cleanFirstName + randomNumbers;
  };

  const create = async (data) => {
    setError("");
    try {
      const username = generateUsername(data.name);
      const accountData = { ...data, username };
      const userData = await authService.createAccount(accountData);
      if (userData) {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) dispatch(login({ userData: currentUser }));
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Sign up failed");
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
    <div className="flex min-h-screen w-full bg-black">
      {/* Left: Readora side scene */}
      <div className="hidden lg:flex lg:w-1/2 lg:min-h-screen shrink-0">
        <LoginScene />
      </div>

      {/* Right: Signup form - same height/width as Login form */}
      <main className="relative z-10 flex flex-1 min-h-screen flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
        <div
          className="w-full max-w-md rounded-2xl p-8 sm:p-10 text-white min-h-[520px] flex flex-col justify-center"
          style={{
            background: "rgba(255, 255, 255, 0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="mb-8 text-center">
            <h1 className="font-bebas text-3xl sm:text-4xl tracking-tight text-white">
              Readora
            </h1>
            <h2 className="mt-4 text-xl font-semibold text-white">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Join to start reading and writing
            </p>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-amber-400 hover:text-amber-300 transition-colors"
            >
              Sign in
            </Link>
          </p>

          {error && (
            <p className="mt-4 text-center text-sm text-red-400">{error}</p>
          )}

          <form onSubmit={handleSubmit(create)} className="mt-8 space-y-5">
            <Input
              label="Full name"
              placeholder="Enter your full name"
              className={inputClass}
              {...register("name", { required: true })}
            />

            <Input
              label="Email address"
              type="email"
              placeholder="Enter your email"
              className={inputClass}
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
              className={inputClass}
              {...register("password", { required: true })}
            />

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-amber-500 py-3 text-sm font-semibold text-black hover:bg-amber-400 transition-colors"
            >
              Create account
            </button>
          </form>

          <div className="mt-6">
            <button
              type="button"
              onClick={googleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 py-3 text-sm font-medium text-zinc-200 hover:bg-white/10 transition-colors"
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

          <p className="mt-8 text-center text-xs text-zinc-500">
            Secure signup powered by Appwrite
          </p>
        </div>
      </main>
    </div>
  );
}

export default Signup;
