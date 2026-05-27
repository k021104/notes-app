const Note = require('../models/Note')

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body

    const newNote = await Note.create({
      title,
      content,
      user: req.user.id
    })

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: newNote
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id
    }).sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params

    const note = await Note.findOneAndDelete({
      _id: id,
      user: req.user.id
    })

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateNote = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: id,
        user: req.user.id
      },
      {
        title,
        content
      },
      {
        new: true
      }
    )

    if (!updatedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      })
    }

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: updateNote
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const pinNote = async (req, res) => {
  try {
    const { id } = req.params

    const note = await Note.findOne({
      _id: id,
      user: req.user.id
    })

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      })
    }

    note.isPinned = !note.isPinned

    await note.save()

    res.status(200).json({
      success: true,
      message: note.isPinned
        ? 'Note pinned successfully'
        : 'Note unpinned successfully',
      data: note
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

//Get single note api
const getSingleNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!note) {
      return res.status(404).json({
        message: 'Note not found'
      })
    }

    res.status(200).json(note)
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

module.exports = {
  createNote,
  getAllNotes,
  getSingleNote,
  deleteNote,
  updateNote,
  pinNote
}
