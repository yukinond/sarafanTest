import { Cooking } from '~/server/lib/models/Cooking'
import { v4 as uuid } from 'uuid'
import { navbarDataList } from '~/data/navbar/navbarData'

export default eventHandler(async (event) => {

  const user = await getAdminEntity(event)
  if (!user) return sendRedirect(event, '/auth', 302)

  const body = await readBody(event)
  const { type, name, composition,  image } = body
  const { uuid } = getQuery(event)

  const data = await Cooking.findOne({ uuid: uuid })

  if (!data) {
    throw createError({
      statusCode: 400,
      message: 'Метод не найден'
    })
  }

  if (type) data.type = type
  if (name) data.name = name
  if (composition) data.composition = composition
  if (image) data.image = image 
   data.updatedDate = new Date()

  const res = await data.save()
  if (!res) {
    throw createError({
      statusCode: 400,
      message: 'Не удалось обновить данные'
    })
  }

  return {
    status: 'ok',
  }
})
