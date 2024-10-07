import { Review } from '~/server/lib/models/Review';
import { User } from '~/server/lib/models/User';

export default eventHandler(async (event) => {
  const user = await getAdminEntity(event);
  if (!user) return sendRedirect(event, '/auth', 302);

  const body = getQuery(event);
  const {  userUuid, reviewed } = body;

  const params = {}

  if (userUuid) {
    params.user = userUuid;
  }


  const orders = await Review.find(params).sort({ _id: -1 });



  return { orders };
});
