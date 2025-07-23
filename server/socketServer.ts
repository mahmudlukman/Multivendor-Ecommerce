import { Server as SocketIOServer } from "socket.io";
import http from "http";

export const initSocketServer = (server: http.Server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  let users: any[] = [];

  const addUser = (userId: string, socketId: string) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };

  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (receiverId: string) => {
    return users.find((user) => user.userId === receiverId);
  };

  // Define a message object with a seen property
  const createMessage = ({ senderId, receiverId, text, conversationId, images }: any) => ({
    senderId,
    receiverId,
    text,
    conversationId,
    images,
    seen: false,
  });

  io.on("connection", (socket) => {
    // when connect
    console.log(`a user is connected`);

    // take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    // send and get message
    const messages: any = {}; // Object to track messages sent to each user

    socket.on("sendMessage", ({ senderId, receiverId, text, conversationId, images }) => {
      const message = createMessage({ senderId, receiverId, text, conversationId, images });
      const user = getUser(receiverId);

      // Store the messages in the `messages` object
      if (!messages[receiverId]) {
        messages[receiverId] = [message];
      } else {
        messages[receiverId].push(message);
      }

      // send the message to the receiver
      if (user) {
        io.to(user.socketId).emit("getMessage", message);
      }
    });

    socket.on("messageSeen", ({ senderId, receiverId, messageId }) => {
      const user = getUser(senderId);
      
      // update the seen flag for the message
      if (messages[senderId]) {
        const message = messages[senderId].find(
          (message: any) =>
            message.receiverId === receiverId && message.id === messageId
        );
        if (message) {
          message.seen = true;
          // send a message seen event to the sender
          if (user) {
            io.to(user.socketId).emit("messageSeen", {
              senderId,
              receiverId,
              messageId,
            });
          }
        }
      }
    });

    // update and get last message
    socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }) => {
      io.emit("getLastMessage", {
        lastMessage,
        lastMessagesId,
      });
    });

    // when disconnect
    socket.on("disconnect", () => {
      console.log(`a user disconnected!`);
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};