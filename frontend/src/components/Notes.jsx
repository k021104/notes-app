import React, { useEffect, useState } from 'react'
import api from '../api/axios'
import { BsPinAngle } from 'react-icons/bs'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import { RxCrossCircled } from 'react-icons/rx'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Notes ({ search }) {
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editId, setEditId] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [openModel, setOpenModel] = useState(false)

  const navigate = useNavigate()

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes')
      setNotes(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const createNote = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        return
      }

      const response = await api.post('/notes/create', {
        title,
        content
      })

      toast.success('Note created successfully', { autoClose: 1000 })

      console.log(response.data)

      setTitle('')
      setContent('')
      setOpenModel(false)

      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create note')
    }
  }

  const deleteNote = async id => {
    try {
      const response = await api.delete(`/notes/delete/${id}`)
      toast.error('Note Deleted successfully', { autoClose: 2000 })
      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete note')
    }
  }

  const updateNote = async () => {
    try {
      const response = await api.put(`/notes/update/${editId}`, {
        title,
        content
      })

      toast.info('Note updated successfully', { autoClose: 1000 })

      setTitle('')
      setContent('')
      setEditId(null)
      setIsEditing(false)
      setOpenModel(false)

      fetchNotes()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update note')
    }
  }

  const editMode = note => {
    setTitle(note.title)
    setContent(note.content)

    setEditId(note._id)

    setIsEditing(true)
    setOpenModel(true)
  }

  const togglePin = async id => {
    try {
      const response = await api.put(`/notes/pin/${id}`)

      setNotes(prevNotes =>
        prevNotes.map(note =>
          note._id === id
            ? {
                ...note,
                isPinned: response.data.data.isPinned
              }
            : note
        )
      )

      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const sortedNotes = [...notes].sort((a, b) => b.isPinned - a.isPinned)

  const filteredNotes = sortedNotes.filter(note => {
    const noteTitle = note.title || ''
    // const noteContent = note.content || ''
    const searchText = search || ''

    return noteTitle.toLowerCase().includes(searchText.toLowerCase())
    // noteContent.toLowerCase().includes(searchText.toLowerCase())
  })

  return (
    <div className='min-h-screen bg-slate-50 px-8 py-6'>
      <div className='flex items-center justify-between mb-8'>
        <div>
          <h1 className='text-3xl font-semibold text-slate-900 tracking-tight'>
            My Notes
          </h1>

          <p className='text-sm text-slate-500 mt-1'>
            Manage and organize your notes efficiently
          </p>
        </div>

        <button
          onClick={() => {
            setIsEditing(false)
            setEditId(null)
            setTitle('')
            setContent('')
            setOpenModel(true)
          }}
          className='bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition shadow-sm shadow-blue-600/10'
        >
          + Add Note
        </button>
      </div>

      {filteredNotes.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-10 text-center'>
          <div className='bg-white border border-slate-200 shadow-sm rounded-3xl px-10 py-12 max-w-md'>
            <div className='text-6xl mb-4'>📝</div>

            <h2 className='text-2xl font-semibold text-slate-800'>
              No Notes Yet
            </h2>

            <p className='text-slate-500 mt-3 leading-7'>
              Start organizing your ideas, tasks, and thoughts by creating your
              first note.
            </p>

            <button
              onClick={() => {
                setIsEditing(false)
                setEditId(null)
                setTitle('')
                setContent('')
                setOpenModel(true)
              }}
              className='mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition'
            >
              + Create First Note
            </button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {filteredNotes.map(note => (
            <div
              key={note._id}
              className={`rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border ${
                note.isPinned
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-slate-200'
              }`}
              onClick={() => navigate(`/notes/${note._id}`)}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <BsPinAngle
                      size={17}
                      onClick={() => togglePin(note._id)}
                      className={`cursor-pointer transition shrink-0 mt-1 ${
                        note.isPinned
                          ? 'text-blue-600'
                          : 'text-slate-400 hover:text-blue-600'
                      }`}
                    />

                    <h2 className='text-lg font-semibold text-slate-800 line-clamp-1'>
                      {note.title}
                    </h2>
                  </div>

                  <p className='text-xs text-slate-400 mt-2'>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className='flex items-center gap-3 ml-3 mt-2'>
                  <button
                    onClick={() => editMode(note)}
                    className='text-slate-400 hover:text-blue-600 transition cursor-pointer'
                  >
                    <FiEdit2 size={18} />
                  </button>

                  <button
                    onClick={() => deleteNote(note._id)}
                    className='text-slate-400 hover:text-red-500 transition cursor-pointer'
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>

              <div className='h-px bg-slate-100 my-4'></div>

              <div className='text-sm text-slate-600 leading-7 line-clamp-5 mt-2'>
                {note.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {openModel && (
        <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4'>
          <div className='bg-white w-full max-w-lg rounded-3xl p-7 shadow-2xl border border-slate-200'>
            <div className='flex items-center justify-between mb-5'>
              <h2 className='text-2xl font-semibold text-slate-800'>
                {isEditing ? 'Edit Note' : 'Add New Note'}
              </h2>

              <button
                onClick={() => {
                  setOpenModel(false)
                  setTitle('')
                  setContent('')
                  setIsEditing(false)
                  setEditId(null)
                }}
                className='text-slate-400 hover:text-red-500 text-xl'
              >
                <RxCrossCircled />
              </button>
            </div>

            <input
              type='text'
              placeholder='Enter note title'
              value={title}
              onChange={e => setTitle(e.target.value)}
              className='w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 mb-5 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition'
            />

            <textarea
              rows={6}
              placeholder='Write your note here...'
              value={content}
              onChange={e => {
                setContent(e.target.value)
              }}
              className='w-full border border-slate-200 bg-slate-50 rounded-2xl px-4 py-3 resize-none outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition'
            />

            <div className='flex justify-end gap-3 mt-7'>
              <button
                onClick={() => setOpenModel(false)}
                className='px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 transition font-medium'
              >
                Cancel
              </button>

              <button
                onClick={isEditing ? updateNote : createNote}
                className='px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-sm shadow-blue-600/20'
              >
                {isEditing ? 'Update Note' : 'Create Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notes
