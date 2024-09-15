import { Cooking } from '~/server/lib/models/Cooking'
import { v4 as uuid } from 'uuid'
import { navbarDataList } from '~/data/navbar/navbarData'

export default eventHandler(async (event) => {

  const user = await getAdminEntity(event)
  if (!user) return sendRedirect(event, '/auth', 302)

  const { uuid } = getQuery(event)

  const data = await Cooking.findOne({ uuid: uuid })

  if (!data) {
    throw createError({
      statusCode: 400,
      message: 'Метод не найден'
    })
  }

  const res = await data.deleteOne()

  if (!res) {
    throw createError({
      statusCode: 400,
      message: 'Не удалось удалить данные'
    })
  }

  return {
    status: 'ok',
  }
})
