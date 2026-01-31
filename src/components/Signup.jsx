import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
  <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-zinc-900 p-8 sm:p-10">
    
    {/* Logo */}
    <div className="mb-6 flex justify-center">
      <span className="inline-block w-full max-w-[90px] opacity-90">
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
    <form onSubmit={handleSubmit(create)} className="mt-8">
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
    </form>
  </div>
</div>

  )
}

export default Signup