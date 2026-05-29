import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { BiArchiveOut } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import { HiOutlineArchiveBoxXMark } from 'react-icons/hi2'
import { toast } from 'react-toastify'

function ArchivedNotes () {
  const [archivedNotes, setArchivedNotes] = useState([])

  const navigate = useNavigate()

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes/archived')
      setArchivedNotes(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const unarchiveNote = async id => {
    try {
      const response = await api.put(`/notes/unarchive/${id}`)
      toast.success('Note unarchived successfully', { autoClose: 1000 })
      fetchNotes()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div className='min-h-screen bg-slate-50 px-8 py-6'>
      {/* Top Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-semibold text-slate-900 tracking-tight'>
            Archived Notes
          </h1>

          <p className='text-sm text-slate-500 mt-1'>
            Your archived notes are stored here safely
          </p>
        </div>

        {/* <button
          onClick={() => navigate('/')}
          className='bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 px-5 py-3 rounded-xl font-medium transition shadow-sm'
        >
          ← Back To Home
        </button> */}
      </div>

      {/* Empty State */}
      {archivedNotes.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300'>
          {/* <div className='bg-white border border-slate-200 shadow-sm rounded-3xl px-10 py-12 max-w-md'> */}
          <HiOutlineArchiveBoxXMark className='text-slate-300 mb-4' size={70} />

          <h2 className='text-2xl font-semibold text-slate-700'>
            No Archived Notes
          </h2>

          <p className='text-slate-400 mt-2'>
            Notes that you archive will appear here.
          </p>
          {/* </div> */}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {archivedNotes.map(note => (
            <div
              key={note._id}
              onClick={() => navigate(`/notes/${note._id}`)}
              className='cursor-pointer rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border bg-white border-slate-200'
            >
              {/* Top Section */}
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <h2 className='text-lg font-semibold text-slate-800 line-clamp-1'>
                    {note.title}
                  </h2>

                  <p className='text-xs text-slate-400 mt-2'>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-3 ml-3 mt-1'>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      unarchiveNote(note._id)
                    }}
                    className='text-slate-400 hover:text-yellow-500 transition cursor-pointer'
                  >
                    <BiArchiveOut size={20} />
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className='h-px bg-slate-100 my-4'></div>

              {/* Content */}
              <div className='text-sm text-slate-600 leading-7 line-clamp-5'>
                <pre>{note.content}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ArchivedNotes
