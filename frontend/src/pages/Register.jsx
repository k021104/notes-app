import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { MdModeEdit } from 'react-icons/md'
// import { MdModeEdit } from "react-icons/md";
import { MdPushPin } from 'react-icons/md'
import { toast } from 'react-toastify'
import api from '../api/axios'

function Register () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async e => {
    e.preventDefault()

    let newErrors = {}

    if (!name) {
      newErrors.name = 'name is required'
    }

    if (!email) {
      newErrors.email = 'email is required'
    }

    if (!password) {
      newErrors.password = 'password is required'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (password && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors(newErrors)
    setLoading(true)

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      })
      console.log(response.data)
      setName('')
      setEmail('')
      setPassword('')

      setLoading(false)

      toast.success('Registration Successful', { autoClose: 2000 })
      navigate('/login')
    } catch (error) {
      setLoading(false)
      setErrors({
        apiError: error.response?.data?.message || 'Something went wrong'
      })
    }
  }

  return (
    <div className='min-h-screen bg-slate-50 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200/60 shadow-sm'>
        <h1 className='text-3xl font-semibold text-slate-950 text-center tracking-tight'>
          Create Account
        </h1>
        <p className='text-sm text-slate-500 text-center mt-2'>
          Register to continue to your notes workspace
        </p>
        <form className='mt-8 space-y-5'>
          <div>
            <label className='block text-xs font-medium uppercase tracking-wider text-slate-500 mb-2'>
              Name
            </label>
            <input
              type='text'
              placeholder='Enter Name'
              value={name}
              onChange={e => {
                setName(e.target.value)

                setErrors(prev => ({
                  ...prev,
                  name: '',
                  apiError: ''
                }))
              }}
              className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition'
            />
            {errors.name && (
              <span className='text-sm text-red-500 mt-1 ms-1 block'>
                {errors.name}
              </span>
            )}
          </div>
          <div>
            <label className='block text-xs font-medium uppercase tracking-wider text-slate-500 mb-2'>
              Email
            </label>
            <input
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={e => {
                setEmail(e.target.value)

                setErrors(prev => ({
                  ...prev,
                  email: '',
                  apiError: ''
                }))
              }}
              className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition'
            />
            {errors.email && (
              <span className='text-sm text-red-500 mt-1 ms-1 block'>
                {errors.email}
              </span>
            )}
          </div>
          <div>
            <label className='block text-xs font-medium uppercase tracking-wider text-slate-500 mb-2'>
              Password
            </label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter password'
                value={password}
                onChange={e => {
                  setPassword(e.target.value)

                  setErrors(prev => ({
                    ...prev,
                    password: '',
                    apiError: ''
                  }))
                }}
                className='w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition cursor-pointer'
              >
                {showPassword ? <BsEye size={20} /> : <BsEyeSlash size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className='text-sm text-red-500 mt-1 ms-1 block'>
                {errors.password}
              </span>
            )}
          </div>

          {errors.apiError && (
            <p className='text-sm text-red-500 text-center mt-4'>
              {errors.apiError}
            </p>
          )}

          <button
            onClick={handleRegister}
            type='submit'
            className='w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition duration-200 mt-8 cursor-pointer shadow-sm shadow-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed'
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className='text-sm text-slate-500 text-center mt-6'>
          Already have an account?{' '}
          <span
            className='text-blue-600 font-medium cursor-pointer hover:underline'
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  )
}

export default Register
