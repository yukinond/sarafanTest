import { Cooking } from '~/server/lib/models/Cooking'

export default eventHandler(async (event) => {
  const user = await getAdminEntity(event);
  if (!user) return sendRedirect(event, '/auth', 302);

  const menu = await Cooking.find().select('-image'); 

  return menu;
});
