import { Menu } from '~/server/lib/models/Menu'

export default eventHandler(async (event) => {

  const body = getQuery(event)
  const { uuid } = body

  const menu = await Menu.findOne({ uuid: uuid }) 

  return menu
})
