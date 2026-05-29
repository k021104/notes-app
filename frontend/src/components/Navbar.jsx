import React, { useState } from 'react'
import { IoChevronDown, IoSearchOutline } from 'react-icons/io5'
import { VscAccount } from 'react-icons/vsc'
import { Link, useNavigate } from 'react-router-dom'

function Navbar ({ search, setSearch }) {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?')

    if (confirmLogout) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      // localStorage.removeItem('token')

      navigate('/login')
    }
  }

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <div className='flex justify-between items-center px-16 py-1 bg-white border-b border-slate-200 shadow-sm'>
      <div className='flex items-center gap-6'>
        <Link
          // onClick={() => navigate('/')}
          to='/'
          className='text-[15px] font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer'
        >
          Notes
        </Link>

        <Link
          // onClick={() => navigate('/archived')}
          to='/archived'
          className='text-[15px] font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer'
        >
          Archived
        </Link>

        <Link
          // onClick={() => navigate('/trash')}
          to='/trash'
          className='text-[15px] font-semibold text-slate-700 hover:text-blue-600 transition cursor-pointer'
        >
          Trash
        </Link>
      </div>
      <div className='relative flex items-center'>
        <input
          type='search'
          placeholder='Search...'
          value={search}
          onChange={e => setSearch(e.target.value)}
          className='w-72 px-4 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition'
        />
        <span className='absolute right-4 text-slate-400'>
          <IoSearchOutline size={20} />
        </span>
      </div>

      <div className='relative'>
        <div
          onClick={() => setShowDropdown(!showDropdown)}
          className='flex items-center gap-3 cursor-pointer px-3 py-2 rounded-xl hover:bg-slate-100 transition'
        >
          <div>
            <VscAccount
              className='p-2 rounded-full bg-blue-50 text-blue-600 border border-blue-100'
              style={{ height: '42px', width: '42px' }}
            />
          </div>

          <div className='flex flex-col'>
            <span className='text-sm font-semibold text-slate-800'>
              {user?.name}
            </span>

            {/* <span className='text-xs text-slate-500'>krishna@gmail.com</span> */}
          </div>

          <IoChevronDown
            className={`text-slate-500 transition duration-200 ${
              showDropdown ? 'rotate-180' : ''
            }`}
          />
        </div>

        {showDropdown && (
          <div className='absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden z-50'>
            <div className='px-4 py-3 border-b border-slate-100'>
              <p className='text-sm font-semibold text-slate-800'>
                {user?.name}
              </p>

              <p className='text-xs text-slate-500 mt-1'>{user?.email}</p>
            </div>

            <button
              onClick={handleLogout}
              className='w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition cursor-pointer'
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
