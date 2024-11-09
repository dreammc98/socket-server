const { trimStr } = require("./utils");

let users = [];

const findUser = (user) => {
  const userName = trimStr(user.name);
  const userRoom = trimStr(user.room);

  return users.find((u) => u.name.trim() === userName && u.room.trim() === userRoom);
};

const addUser = (user) => {
  const isExist = findUser(user);
  !isExist && users.push(user);

  return { isExist: !!isExist, user: isExist || user };
};

const getRoomUsers = (room) => {
  console.log(users);

  return users.filter((user) => user.room === room);
};

const leaveRoom = (user) => {
  const currentUser = findUser(user);
  users = users.filter((u) => !(u.name === currentUser.name && u.room === currentUser.room));
  getRoomUsers(user.room);
  return currentUser;
};
module.exports = {
  addUser,
  findUser,
  getRoomUsers,
  leaveRoom,
};
