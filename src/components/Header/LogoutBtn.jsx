import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { flushSync } from 'react-dom'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { Button } from '@/components/ui/button'

function LogoutBtn() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      await authService.logout()
      flushSync(() => dispatch(logout()))
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout failed', error)
    }
  }
  return (
    <Button
    variant='destructive'
    className='inline-bock px-6 py-2 duration-200 hover:bg-red-100 hover:text-black rounded-full'
    onClick={logoutHandler}
    >Logout</Button>
  )
}

export default LogoutBtn