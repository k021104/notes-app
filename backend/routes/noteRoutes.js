const express = require('express')
const router = express.Router()

const {
  createNote,
  getAllNotes,
  getSingleNote,
  deleteNote,
  updateNote,
  pinNote,
  archiveNote,
  unarchiveNote,
  getArchivedNotes,
  getTrashedNotes,
  restoreNote,
  permanentDeleteNote
} = require('../controllers/noteController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/create', verifyToken, createNote)
router.get('/', verifyToken, getAllNotes)

//archive notes api
router.get('/archived', verifyToken, getArchivedNotes)
router.put('/archive/:id', verifyToken, archiveNote)
router.put('/unarchive/:id', verifyToken, unarchiveNote)
router.get('/trash', verifyToken, getTrashedNotes)
router.put('/restore/:id', verifyToken, restoreNote)
router.delete('/permanent-delete/:id', verifyToken, permanentDeleteNote)
router.put('/pin/:id', verifyToken, pinNote)
router.put('/update/:id', verifyToken, updateNote)
router.delete('/delete/:id', verifyToken, deleteNote)
router.get('/:id', verifyToken, getSingleNote)

module.exports = router
