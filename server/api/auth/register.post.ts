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
    email,
    password,
  
  } = body

  // if (!name || !lastname) {
  //   return { status: 'error', error: 'Некорректное имя' }
  // }

  if (!email || !password)
    return { status: 'error', error: 'missing email or password' }

  if (!validator.isEmail(email)) {
    return {
      status: 'error',
      error: 'Некорректный email.',
    }
  }

  if (password.length < 6 || password.length > 36) {
    return {
      status: 'error',
      error: 'Пароль должен быть от 6 до 36 символов.',
    }
  }
  const session = await getServerSession(event)
  if (session) return { status: 'error', error: 'Вы уже авторизованы.' }

  const checkEmail = await User.findOne({
    email: { $regex: new RegExp(email, 'i') },
  })
  if (checkEmail) {
    return {
      status: 'error',
      error: 'Пользователь с таким email уже существует.',
    }
  }

  const hash = bcrypt.hashSync(password, 7)

  const newUsername = await createUsername(email)

  const user: any = new User({
    email,
    password: hash,
    username: newUsername,
    roles: ['user'],
    uuid: uuid(),
    emailConfirmed: true,
  })
  await user.save()
  // const url = useRuntimeConfig().PUBLIC_SITE_URL
  // const link = `${url}/api/auth/activate?uuid=${user.uuid}`
  // try {
  //   await MailService.sendActivationMail(user.email, link)
  // } catch (error) {
  //   return { status: 'error', error: 'Ошибка отправки письма.' }
  // }

  return { status: 'ok', error: null }
})
