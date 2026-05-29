import { useEffect, useState } from 'react'
import api from '../api/axios'
// import { useNavigate } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import { MdRestore } from 'react-icons/md'
import { toast } from 'react-toastify'

function TrashNotes () {
  const [trashedNotes, setTrashedNotes] = useState([])

  // const navigate = useNavigate()

  const fetchTrashNotes = async () => {
    try {
      const response = await api.get('/notes/trash')
      setTrashedNotes(response.data || [])
    } catch (error) {
      console.log(error)
    }
  }

  const restoreNote = async id => {
    try {
      await api.put(`/notes/restore/${id}`)
      fetchTrashNotes()
      toast.success('Note restored')
    } catch (error) {
      console.log(error)
    }
  }

  const permanentDelete = async id => {
    try {
      await api.delete(`/notes/permanent-delete/${id}`)
      fetchTrashNotes()
      toast.success('Note deleted permanently')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTrashNotes()
  }, [])

  return (
    <div className='min-h-screen bg-slate-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-slate-800'>Trash Notes</h1>

            <p className='text-slate-500 mt-1'>
              Deleted notes can be restored or removed permanently.
            </p>
          </div>
        </div>

        {trashedNotes.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300'>
            <FiTrash2 className='text-slate-300 mb-4' size={70} />

            <h2 className='text-2xl font-semibold text-slate-700'>
              Trash is Empty
            </h2>

            <p className='text-slate-400 mt-2'>
              Deleted notes will appear here.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {trashedNotes.map(note => (
              <div
                key={note._id}
                // onClick={() => navigate(`/notes/${note._id}`)}
                className='cursor-pointer rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border bg-white border-slate-200'
              >
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <h2 className='text-lg font-semibold text-slate-800 line-clamp-1'>
                      {note.title}
                    </h2>

                    <p className='text-xs text-slate-400 mt-2'>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className='flex items-center gap-3 ml-3 mt-1'>
                    {/* restore */}
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        restoreNote(note._id)
                      }}
                      className='text-slate-400 hover:text-green-600 transition cursor-pointer'
                    >
                      <MdRestore size={20} />
                    </button>

                    {/* permanent delete */}

                    <button
                      onClick={e => {
                        e.stopPropagation()
                        permanentDelete(note._id)
                      }}
                      className='text-slate-400 hover:text-red-500 transition cursor-pointer'
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className='h-px bg-slate-100 my-4'></div>

                <div className='text-sm text-slate-600 leading-7 line-clamp-5'>
                  <pre>{note.content}</pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrashNotes
