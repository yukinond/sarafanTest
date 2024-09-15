import { Order } from '~/server/lib/models/Order'
import { v4 as uuid } from 'uuid'
import { DocuemntEnum } from '~/data/enums'
import { navbarDataList } from '~/data/navbar/navbarData'

export default eventHandler(async (event) => {
  const user = await getAdminEntity(event)
  const body = await readBody(event)

  const { name, phone, email, address, pickup, comment}: any = body.order 
  const cart = body.cart

  if (!cart) {
    throw createError({
      statusCode: 400,
      message: 'Корзина пуста',
    })
  }


  if (!name || !phone || !email  ) {
    throw createError({
      statusCode: 400,
      message: `Не заполнено: ${name ? '' : 'имя'} ${phone ? '' : 'телефон'} ${email ? '' : 'email'} ${address ? '' : 'адрес'}`,
    })
  }

  const created = new Order({
    user: user.uuid || 'no auth',
    name: name,
    email: email,
    phone: phone,
    address: pickup ? 'Самовывоз' : address,
    comment: comment ? comment : 'Нет.',
    pickupAddress: pickup ? 'г.Казань ул Меридианная 10а' : 'Доставка',
    createdDate: new Date(),
    products: cart,
    uuid: uuid(),
  })

  const res = await created.save()
  
  return {
    status: 'ok',
  }
})
