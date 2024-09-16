import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'
import validator from 'validator'
import { getServerSession } from '#auth'
import { User } from '~~/server/lib/models/User'
import { createUsername } from '~/server/utils/createUsername'

function hasWhiteSpace(s: string) {
  return s.includes(' ') || !/^[a-zA-Z0-9_-]{4,14}$/.test(s)
}

export default eventHandler(async (event) => {
  const body = await readBody(event)

  const {
    uuid,
    email,
    password,
    username,
    role
  } = body

  if (!uuid || !email || !role)
    return { status: 'error', error: 'Missing required fields.' }

  if (!validator.isEmail(email)) {
    return {
      status: 'error',
      error: 'Invalid email.',
    }
  }

  if (password && (password.length < 6 || password.length > 36)) {
    return {
      status: 'error',
      error: 'Password must be between 6 and 36 characters.',
    }
  }

  const session = await getServerSession(event)
  if (!session) return { status: 'error', error: 'Not authenticated.' }

  const user = await User.findOne({ uuid })
  if (!user) {
    return {
      status: 'error',
      error: 'User not found.',
    }
  }

  if (email !== user.email) {
    const checkEmail = await User.findOne({
      email: { $regex: new RegExp(email, 'i') },
    })
    if (checkEmail) {
      return {
        status: 'error',
        error: 'A user with this email already exists.',
      }
    }
  }

  if (password) {
    user.password = bcrypt.hashSync(password, 7)
  }
  
  if (username) {
    user.username = username
  }
  
  user.email = email
  user.role = role === 'admin' ? 'admin' : 'user'

  await user.save()

  return { status: 'ok', error: null }
})
