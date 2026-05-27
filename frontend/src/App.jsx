import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Notes from './components/Notes'
import Login from './pages/Login'
import Register from './pages/Register'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home'
import ProtectedRoutes from './components/ProtectedRoutes'
import ViewNote from './pages/ViewNote'
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
        <Route path='/login' element={<Login />} />

        <Route path='/register' element={<Register />} />

        {/* <Route
          path='/navbar'
          element={<Navbar/>}
        /> */}

        <Route
          path='/'
          element={
            <ProtectedRoutes>
              <Home />
            </ProtectedRoutes>
          }
        />

        <Route
          path='/notes/:id' element={<ViewNote />}
        />

        {/* <Route
          path='/notes'
          element={
            <ProtectedRoutes>
              <Notes />
            </ProtectedRoutes>
          }
        /> */}
      </Routes>
    </>
  )
}

export default App
