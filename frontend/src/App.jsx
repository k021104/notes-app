import { useState, useEffect } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Notes from './components/Notes'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoutes from './components/ProtectedRoutes'
import ViewNote from './pages/ViewNote'
import ArchivedNotes from './pages/ArchivedNotes'
import MainLayout from './layout/MainLayout'
import TrashNotes from './pages/TrashNotes'
// import './App.css'

function App () {
  return (
    <>
      <ToastContainer
        position='top-right'
        hideProgressBar
        closeOnClick
        pauseOnHover
        theme='light'
      />

      <Routes>
        {/* Default Route */}
        <Route
          path='/'
          element={
            localStorage.getItem('accessToken') ? (
              <Navigate to='/notes' />
            ) : (
              <Navigate to='/login' />
            )
          }
        />

        {/* Public Routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoutes />}>
          {/* Navbar Layout */}
          <Route element={<MainLayout />}>
            <Route path='/notes' element={<Notes />} />

            <Route path='/archived' element={<ArchivedNotes />} />

            <Route path='/notes/:id' element={<ViewNote />} />

            <Route path='/trash' element={<TrashNotes />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App
