import DBLocal from 'db-local'
import Crypto from 'node:crypto'
import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config.js'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static async create ({ username, password }) {
    // validaciones username
    Validations.username(username)
    Validations.password(password)

    const user = User.findOne({ username })
    if (user) {
      throw new Error('username already exists')
    }

    const id = Crypto.randomUUID()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
    User.create({
      _id: id,
      username,
      password: hashedPassword
    }).save()

    return id
  }

  static async login ({ username, password }) {
    Validations.username(username)
    Validations.password(password)

    const user = User.findOne({ username })

    if (!user) {
      throw new Error('invalid username')
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      throw new Error('invalid password')
    }

    const { password: _, ...publicUser } = user

    return publicUser
  }
}

class Validations {
  static username (username) {
    if (typeof username !== 'string' || username.length < 3) {
      throw new Error('username must be a string with at least 3 characters')
    }
  }

  static password (password) {
    if (typeof password !== 'string' || password.length < 6) {
      throw new Error('password must be a string with at least 6 characters')
    }
  }
}
