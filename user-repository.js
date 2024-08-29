import DBLocal from 'db-local'
import Crypto from 'crypto'
import Schema from 'db-local/lib/modules/schema'
const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
  _ID: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true }
})

export class UserRepository {
  static create ({ username, password }) {
    // validaciones username
    if (typeof username !== 'string' || username.length < 3) {
      throw new Error('username must be a string with at least 3 characters')
    }

    if (typeof password !== 'string' || password.length < 6) {
      throw new Error('password must be a string with at least 6 characters')
    }

    const user = User.findOne({ username })
    if (user) {
      throw new Error('username already exists')
    }

    const id = Crypto.randomUUID()
  }
  static login ({ username, password }) {}
}
