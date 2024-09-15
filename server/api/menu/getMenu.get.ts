import { Menu } from '~/server/lib/models/Menu'

export default eventHandler(async (event) => {

  const body = getQuery(event)
  const { type, uuid, searchQuery } = body

  let data
  if (uuid) {
    data = await Menu.findOne({ uuid: uuid })
    return { data: data }
  }
  if (type) {
    data = await Menu.find({ menuType: type })
    return { data: data }
  }

  const params = searchQuery
    ? {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { uuid: { $regex: searchQuery, $options: 'i' } },
      ],
    }
    : {}

  const menu = await Menu.find(params) 

  return { menu: menu }
})
