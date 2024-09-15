import { Menu } from '~/server/lib/models/Menu'
import { v4 as uuid } from 'uuid'
import { navbarDataList } from '~/data/navbar/navbarData'

export default eventHandler(async (event) => {

  const user = await getAdminEntity(event)
  if (!user) return sendRedirect(event, '/auth', 302)

  const body = await readBody(event)
  const { menuType, name, description, price, image, cooking, details } = body
  const { uuid } = getQuery(event)
  console.log(menuType)

  const data = await Menu.findOne({ uuid: uuid })

  if (!data) {
    throw createError({
      statusCode: 400,
      message: 'Блюдо не найдено'
    })
  }

  if(menuType) data.menuType = navbarDataList.find(navbar => navbar.title === menuType).path.replace('/', '')
  if(name) data.name = name
  if(description) data.description = description
  if(price) data.price = price
  if(image) data.image = image
  if(cooking) data.cooking = cooking
  if(details) data.details = details
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
