import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function MainLayout () {
  const [search, setSearch] = useState('')

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} />

      {/* Pages */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
        <Outlet context={{ search }} />
      </main>
    </div>
  )
}

export default MainLayout
