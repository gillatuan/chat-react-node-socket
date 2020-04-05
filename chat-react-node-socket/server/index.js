const express = require("express")
const socketio = require("socket.io")
const http = require("http")
const cors = require("cors")
const router = require("./router")

const users = require("./users")

const port = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(cors())
app.use(router)

io.on("connection", function (socket) {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = users.addUser({ id: socket.id, name, room })

    if (error) {
      return callback(error)
    }

    if (user) {
      // emit message to current user
      socket.emit("message", {
        user: "admin",
        text: `${name}, welcome to the room`,
      })
      // broadcast to all users in room
      socket.broadcast
        .to(user.room)
        .emit("message", { user: "admin", text: `${name}, has joined!` })
      //
      socket.join(user.room)

      io.to(user.room).emit("roomData", {
        room: user.room,
        users: users.getUsersInRoom(user.room),
      })
    }

    callback()
  })

  socket.on("sendMessage", (message, callback) => {
    const user = users.getUser(socket.id)
    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
    })
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: users.getUsersInRoom(user.room),
    })
    callback()
  })

  socket.on("disconnect", () => {
    const user = users.removeUser(socket.id)
    io.to(user.room).emit("message", {
      user: "admin",
      text: `${user.name} has left`,
    })
  })
})

app.use(router)

const fnServer = () => {
  console.log("Server is running port: ", port)
}
server.listen(port, fnServer)
