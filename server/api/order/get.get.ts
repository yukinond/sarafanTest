import { Order } from '~/server/lib/models/Order';
import { User } from '~/server/lib/models/User';

export default eventHandler(async (event) => {
  const user = await getAdminEntity(event);
  if (!user) return sendRedirect(event, '/auth', 302);

  const body = getQuery(event);
  const { status, searchQuery, userUuid, reviewed } = body;

  const params = searchQuery
    ? {
      $or: [
        { name: { $regex: searchQuery, $options: 'i' } },
        { uuid: { $regex: searchQuery, $options: 'i' } },
      ],
    }
    : {};

  if (status) {
    params.status = { $regex: status, $options: 'i' };
  }

  if (userUuid) {
    params.user = userUuid;
  }
  if(reviewed){
    params.reviewed = reviewed ? { $ne: true } : null;
  }

  const data = await Order.find(params).sort({ _id: -1 });

  const dataUsers = data.map((order) => {
    return order.user
  })

  const users = await User.find({ uuid: { $in: dataUsers } })

  const orders = data.map((order) => {
    const user = users.find((user) => user.uuid === order.user)
    order.user = user ? user : order.user
    return order
  })

  return { orders };
});
