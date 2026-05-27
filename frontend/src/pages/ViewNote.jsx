import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import api from '../api/axios'

function ViewNote () {
  const { id } = useParams()

  const navigate = useNavigate()

  const [note, setNote] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNote()
  }, [])

  const fetchNote = async () => {
    try {
      const res = await api.get(`/notes/${id}`)

      setNote(res.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 flex items-center justify-center'>
        <h1 className='text-lg font-medium text-slate-600'>
          Loading Note...
        </h1>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-slate-50 px-4 py-8'>
      <div className='max-w-4xl mx-auto'>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-2 text-slate-600 hover:text-blue-600 transition mb-6 cursor-pointer'
        >
          <IoArrowBack size={22} />
          <span className='font-medium'>Back to Home</span>
        </button>

        {/* Note Card */}
        <div className='bg-white rounded-3xl border border-slate-200 shadow-sm p-8'>
          {/* Title */}
          <h1 className='text-4xl font-bold text-slate-900 leading-tight wrap-break-word'>
            {note.title}
          </h1>

          {/* Date */}
          <p className='text-sm text-slate-500 mt-3'>
            Created on{' '}
            {new Date(note.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>

          {/* Divider */}
          <div className='w-full h-px bg-slate-200 my-6'></div>

          {/* Content */}
          <div className='text-slate-700 text-[17px] leading-8 whitespace-pre-wrap wrap-break-word'>
            {note.content}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewNote