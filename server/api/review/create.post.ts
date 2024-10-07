import { v4 as generateUuid } from 'uuid'
import { Review } from '~/server/lib/models/Review'
import { Order } from '~/server/lib/models/Order'

export default eventHandler(async (event) => {
  const user = await getAdminEntity(event)
  const body = await readBody(event)

  const { form, uuid, phone, name, products } = body

  console.log('product:', form)
  const order = await Order.findOne({ uuid: uuid })

  if (!order) {
    throw createError({
      statusCode: 400,
      message: 'Заказ не найден',
    })
  }

  order.reviewed = true

  const created = new Review({
    name: name,
    rating: form.rating,
    text: form.text,
    date: new Date(),
    user: user.uuid,
    order: uuid, 
    images: form.photos,
    recipientphone: phone,
    createdAt: new Date(),
    products: products,
    uuid: generateUuid(), 
  })

  const res = await created.save()
  await order.save()

  return {
    status: 'ok',
  }
})
