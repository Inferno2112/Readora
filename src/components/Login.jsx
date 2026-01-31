import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login as authLogin } from "../store/authSlice";
import authService from "../appwrite/auth";
import { Button, Input, Logo } from "./index";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginRef = useRef(null);

  const { register, handleSubmit } = useForm();
  const [error, setError] = useState("");

  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const login = async (data) => {
    setError("");
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="w-full bg-zinc-950 text-zinc-100">

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <Logo width="90px" />

        <h1 className="mt-10 max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight">
          Read smarter. Think deeper. Write freely.
        </h1>

        <p className="mt-6 max-w-xl text-base text-zinc-400 leading-relaxed">
          Readora is a calm, focused space for meaningful reading and writing —
          built for people who value depth over noise.
        </p>

        <button
          onClick={scrollToLogin}
          className="mt-10 rounded-full bg-yellow-400 px-8 py-3 text-sm font-semibold text-black hover:bg-yellow-300 transition"
        >
          Get Started
        </button>

        <p className="mt-6 text-xs text-zinc-500">
          No distractions. Just ideas that matter.
        </p>
      </section>

      {/* ================= LOGIN SECTION ================= */}
      <section
        ref={loginRef}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <div className="w-full max-w-md rounded-2xl bg-zinc-900/90 border border-white/10 px-8 py-10 backdrop-blur">

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <span className="inline-block w-full max-w-[88px] opacity-90">
              <Logo width="100%" />
            </span>
          </div>

          {/* Title */}
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            Welcome back to Readora
          </h2>
          <p className="mt-2 text-center text-sm text-zinc-400">
            Sign in to continue reading and writing
          </p>

          {/* Switch link */}
          <p className="mt-4 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-yellow-400 hover:text-yellow-300 transition"
            >
              Sign up
            </Link>
          </p>

          {/* Error */}
          {error && (
            <p className="mt-6 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">

              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Enter a valid email address",
                  },
                })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password", { required: true })}
              />

              <Button
                type="submit"
                className="
                  mt-2 w-full rounded-full
                  bg-yellow-400 py-2.5
                  text-sm font-semibold text-black
                  hover:bg-yellow-300
                  transition
                "
              >
                Sign in
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-zinc-500">
            Secure login powered by Appwrite
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
    