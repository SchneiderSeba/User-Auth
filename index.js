import express from 'express'
import { PORT } from './config.js'

const app = express()

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/index.html')
})

app.post('/login', (req, res) => {
  res.send({ user: 'assss' })
})
app.post('/register', (req, res) => {})
app.post('/logout', (req, res) => {})

app.get('/protected', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
