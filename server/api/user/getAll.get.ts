import { User } from '@/server/lib/models/User'
import { getServerSession } from '#auth'

export default eventHandler(async (event) => {
  const session = (await getServerSession(event)) as any

  if (!session) return sendRedirect(event, '/auth', 302)

  const user = await User.findOne({ uuid: session.uuid })
  if (!user) return sendRedirect(event, '/auth', 302)

  const users = await User.find()
  const admins = users.filter((user) => user.role === 'admin')
  const clients = users.filter((user) => user.role !== 'admin')

  return {
    data: {admins, clients},
    status: 'ok',
  }
})
