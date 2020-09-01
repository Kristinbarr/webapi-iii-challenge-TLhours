const express = require('express')

const router = express.Router()

const db = require('./userDb')
const Posts = require('../posts/postDb.js')

router.post('/', validateUser, async (req, res) => {
  try {
    console.log(req.body, '<---req.body')
    console.log(req.headers, '<---headers')
    const user = await db.insert({ name: req.body.name })
    if (user) {
      res.status(201).json(user)
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong when creating that user' })
  }
})

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  try {
    console.log(req.body, '<--req.body')
    const post = await Posts.insert(req.body)
    if (post) {
      res.status(201).json(post)
    }
  } catch (error) {
    res.status(500).json({ message: 'There was an error creating the post' })
  }
})

router.get('/', async (req, res) => {
  try {
    const users = await db.get()
    if (users) {
      res.status(200).json(users)
    }
  } catch (error) {
    res.status(500).json({ message: 'There was an error finding tha user' })
  }
})

router.get('/:id', validateUserId, (req, res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    res.status(500).json({ message: 'There was an error finding tha user' })
  }
})

router.get('/:id/posts', validateUserId, (req, res) => {})

router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await db.remove(id)
    if (deleted) {
      res.status(200).json(req.user)
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Something went wrong removing that user.' })
  }
})

router.put('/:id', validateUserId, (req, res) => {})

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params
    const user = await db.getById(id)
    if (user) {
      req.user = user
      next()
    } else {
      res.status(400).json({ message: 'invalid user id' })
    }
  } catch (error) {
    console.error(error)
  }
}

function validateUser(req, res, next) {
  console.log(req.body, '<--req body')
  //   console.log(req, "<---req");
  if (Object.keys(req.body).length === 0) {
    console.log(req.body)
    res.status(400).json({ message: 'missing user data' })
  } else if (!req.body.name) {
    res.status(400).json({ message: 'missing required name field' })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  console.log(req.body, '<--- req body')
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: 'missing post data' })
  } else if (!req.body.text) {
    res.status(400).json({ message: 'missing text data' })
  } else {
    next()
  }
}

module.exports = router
