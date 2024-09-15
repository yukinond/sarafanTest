import { Cooking } from '~/server/lib/models/Cooking'
import { v4 as uuid } from 'uuid'
import { DocuemntEnum } from '~/data/enums'
import { navbarDataList } from '~/data/navbar/navbarData'

export default eventHandler(async (event) => {
  const user = await getAdminEntity(event)
  if (!user) return sendRedirect(event, '/auth', 302)

  const body = await readBody(event)

  const { type, name, composition, image }: any = body


  if (!type || !name || !composition ) {
    throw createError({
      statusCode: 400,
      message: `Не выбрано: ${!type ? 'Тип меню' : !name ? 'Название' : !composition ? 'Описание' : ' '}`,
    })
  }

  const created = new Cooking({
    type: type,
    name,
    composition,
    image: image ? image : 'no image',
    createdDate: new Date(),
    uuid: uuid(),
  })

  const res = await created.save()
  

  return {
    status: 'ok',
  }
})
