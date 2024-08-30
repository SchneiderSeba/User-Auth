import express from 'express'
import { PORT, JWT_SECRET_KEY } from './config.js'
import { UserRepository } from './user-repository.js'
import jwt from 'jsonwebtoken'

const app = express()
app.set('view engine', 'ejs')
app.use(express.json())

app.get('/home', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})

app.get('/', (req, res) => {
  res.render('main')
})
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET_KEY, { expiresIn: '1h' })
    res.send({ user })
  } catch (error) {
    res.status(401).send(error.message)
  }
})
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const id = await UserRepository.create({ username, password })
    res.send({ id })
  } catch (error) {
    res.status(400).send(error.message)
  }
})
app.post('/logout', (req, res) => {})

app.get('/protected', (req, res) => {
  res.render('protected', { user: 'ImperiumAO' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
