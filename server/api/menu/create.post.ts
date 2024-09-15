import { Menu } from '~/server/lib/models/Menu'
import { v4 as uuid } from 'uuid'
import { DocuemntEnum } from '~/data/enums'
import { navbarDataList } from '~/data/navbar/navbarData'

export default eventHandler(async (event) => {
  const user = await getAdminEntity(event)
  if (!user) return sendRedirect(event, '/auth', 302)

  const body = await readBody(event)

  const { menuType, name, description, price, image, cooking, details }: any = body


  if (!menuType || !name  || !price ) {
    throw createError({
      statusCode: 400,
      message: `Не выбрано: ${!menuType ? 'Тип меню' : !name ? 'Название'  : !price ? 'Цена' :  ' '}`,
    })
  }

  const created = new Menu({
    menuType: navbarDataList.find(navbar => navbar.title === menuType).path.replace('/', ''),
    cooking: cooking ? cooking : [],
    details: details ? details : [],
    name,
    description: description ? description : 'Нет описания',
    price,
    image: image ? image : 'no image',
    createdDate: new Date(),
    uuid: uuid(),
  })

  const res = await created.save()
  

  return {
    status: 'ok',
  }
})
