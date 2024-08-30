import express from 'express'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import { PORT, JWT_SECRET_KEY } from './config.js'
import { UserRepository } from './user-repository.js'

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
  const token = req.cookies.access_token
  req.session = { user: null }

  try {
    const data = jwt.verify(token, JWT_SECRET_KEY)
    req.session.user = data
  } catch (error) {}
  next()
})
app.set('view engine', 'ejs')

app.get('/home', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})

app.get('/', (req, res) => {
  const { user } = req.session
  res.render('main', user)
})
app.post('/login', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const user = await UserRepository.login({ username, password })
    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET_KEY, { expiresIn: '1h' })
    res.cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
      .send({ user, token })
  } catch (error) {
    res.status(401).send(error.message)
  }
})
app.post('/register', async (req, res) => {
  const { username, password } = req.body
  console.log(req.body)

  try {
    const id = await UserRepository.create({ username, password })
    // res.send({ id })
    res.redirect('created')
  } catch (error) {
    res.status(400).send(error.message)
  }
})
app.get('/created', (req, res) => {
  res.render('created')
})
app.post('/logout', (req, res) => {
  res.clearCookie('access_token').json({ message: 'logout' })
})

app.get('/protected', (req, res) => {
  const { user } = req.session
  if (!user) {
    return res.status(403).send.apply('Access not authorized').redirect('/')
  }
  res.render('protected', user)
})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
