import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Notes from '../components/Notes'

function Home () {
  const [search, setSearch] = useState('')

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Navbar */}
      <Navbar search={search} setSearch={setSearch} />

      {/* Main Layout */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2'>
        {/* Notes Section */}
        <Notes search={search} />
      </main>
    </div>
  )
}

export default Home
