const users = []

const addUser = (data) => {
  let resp = {}
  // check is existing data
  if (!data.name || !data.room) {
    return (resp.error = "Username and room are required.")
  }

  const name = data.name.trim()
  const room = data.room.trim()

  // check is existing user
  const existingUser = users.find(
    (user) => user.name === name && user.room === room
  )
  if (existingUser) {
    return (resp.error = "User is existing.")
  }

  // insert into array users
  users.push(data)
  resp.user = data

  return resp
}

const getUser = (id) => users.find((user) => user.id === id)
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)
  if (index > -1) {
    return users.splice(index, 1)[0]
  }
}
const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = { addUser, getUser, removeUser, getUsersInRoom }
