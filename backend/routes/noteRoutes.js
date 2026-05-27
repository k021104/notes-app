const express = require('express')
const router = express.Router()

const {
  createNote,
  getAllNotes,
  getSingleNote,
  deleteNote,
  updateNote,
  pinNote
} = require('../controllers/noteController')
const { verifyToken } = require('../middleware/authMiddleware')

router.post('/create', verifyToken, createNote)
router.get('/', verifyToken, getAllNotes)
router.get('/:id', verifyToken, getSingleNote)
router.put('/pin/:id', verifyToken, pinNote)
router.put('/update/:id', verifyToken, updateNote)
router.delete('/delete/:id', verifyToken, deleteNote)

module.exports = router
