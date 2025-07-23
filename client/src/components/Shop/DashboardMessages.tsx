import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import styles from "../../styles/styles";
import { useNavigate } from "react-router-dom";
import {
  useCreateNewMessageMutation,
  useGetAllMessagesQuery,
} from "../../redux/features/message/messageApi";
import {
  useAllUserConversationsQuery,
  useUpdateLastMessageMutation,
} from "../../redux/features/conversation/conversationApi";
import { useGetUserQuery } from "../../redux/features/user/userApi";
import { ServerError, User, Image, Conversation, SellerState } from "../../types";
import toast from "react-hot-toast";

// Socket.io configuration
const ENDPOINT = import.meta.env.VITE_SOCKET_SERVER_URI || "";
if (!ENDPOINT) {
  console.error("Socket server URI is not defined in .env");
}
const socketId = socketIO(ENDPOINT, { transports: ["websocket"], autoConnect: true });

interface Message {
  _id?: string;
  sender: string;
  text: string;
  conversationId: string;
  createdAt: number | string;
  images?: Image;
}

const DashboardMessages = () => {
  const { seller } = useSelector((state: SellerState) => state.sellerAuth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<Message | null>(null);
  const [currentChat, setCurrentChat] = useState<Conversation | undefined>(undefined);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ userId: string }[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [images, setImages] = useState<string | null>(null);
  const [activeStatus, setActiveStatus] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
  const { data: conversationsData, refetch: refetchConversations, isLoading } =
    useAllUserConversationsQuery(seller?._id, { skip: !seller?._id });
  const { data: messagesData, refetch: refetchMessages } = useGetAllMessagesQuery(
    currentChat?._id,
    { skip: !currentChat?._id }
  );
  const [createNewMessage] = useCreateNewMessageMutation();
  const [updateLastMessage] = useUpdateLastMessageMutation();

  // Socket.io connection handling
  useEffect(() => {
    socketId.on("connect", () => {
      console.log("Connected to Socket.IO server");
    });
    socketId.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });
    socketId.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    return () => {
      socketId.off("connect");
      socketId.off("disconnect");
      socketId.off("connect_error");
    };
  }, []);

  // Socket.io message handling
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        conversationId: data.conversationId,
        createdAt: Date.now(),
        images: data.images,
      });
    });
  }, []);

  useEffect(() => {
    if (arrivalMessage && currentChat?.members.includes(arrivalMessage.sender)) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // Set conversations from RTK Query
  useEffect(() => {
    if (conversationsData?.conversations) {
      setConversations(conversationsData.conversations);
    }
  }, [conversationsData]);

  // Socket.io user handling
  useEffect(() => {
    if (seller) {
      socketId.emit("addUser", seller._id);
      socketId.on("getUsers", (data: { userId: string }[]) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  // Set messages from RTK Query
  useEffect(() => {
    if (messagesData?.messages) {
      setMessages(messagesData.messages);
    }
  }, [messagesData]);

  const onlineCheck = (chat: Conversation) => {
    const chatMembers = chat.members.find((member) => member !== seller?._id);
    return chatMembers ? onlineUsers.some((user) => user.userId === chatMembers) : false;
  };

  const sendMessageHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage || !seller || !currentChat) return;

    const message: Message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
      createdAt: Date.now(),
    };

    const receiverId = currentChat.members.find((member) => member !== seller._id);

    // Emit socket message
    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
      conversationId: currentChat._id,
    });

    try {
      const res = await createNewMessage(message).unwrap();
      setMessages([...messages, res.message]);
      await updateLastMessage({
        id: currentChat._id,
        data: { lastMessage: newMessage, lastMessageId: seller._id },
      }).unwrap();
      setNewMessage("");
      refetchMessages();
      refetchConversations();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message || serverError.message || "Failed to send message";
      toast.error(errorMessage);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !seller || !currentChat) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2 && typeof reader.result === "string") {
        setImages(reader.result);
        await imageSendingHandler(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const imageSendingHandler = async (imageData: string) => {
    if (!seller || !currentChat) return;

    const receiverId = currentChat.members.find((member) => member !== seller._id);

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: { url: imageData },
      conversationId: currentChat._id,
    });

    try {
      const res = await createNewMessage({
        images: { url: imageData, public_id: "" }, // public_id may need to be handled server-side
        sender: seller._id,
        text: newMessage,
        conversationId: currentChat._id,
      }).unwrap();
      setImages(null);
      setMessages([...messages, res.message]);
      await updateLastMessage({
        id: currentChat._id,
        data: { lastMessage: "Photo", lastMessageId: seller._id },
      }).unwrap();
      refetchMessages();
      refetchConversations();
    } catch (err: unknown) {
      const serverError = err as ServerError;
      const errorMessage =
        serverError.data?.message || serverError.message || "Failed to send image";
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded">
      {!open && (
        <>
          <h1 className="text-center text-[30px] py-3 font-Poppins">All Messages</h1>
          {conversations.map((item, index) => (
            <MessageList
              data={item}
              key={item._id}
              index={index}
              setOpen={setOpen}
              setCurrentChat={setCurrentChat}
              me={seller?._id || ""}
              setUserData={setUserData}
              userData={userData}
              online={onlineCheck(item)}
              setActiveStatus={setActiveStatus}
              isLoading={isLoading}
            />
          ))}
        </>
      )}

      {open && userData && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller?._id || ""}
          userData={userData}
          activeStatus={activeStatus}
          scrollRef={scrollRef}
          handleImageUpload={handleImageUpload}
          setMessages={setMessages}
        />
      )}
    </div>
  );
};

interface MessageListProps {
  data: Conversation;
  index: number;
  setOpen: (open: boolean) => void;
  setCurrentChat: (chat: Conversation) => void;
  me: string;
  setUserData: (user: User | null) => void;
  userData: User | null;
  online: boolean;
  setActiveStatus: (status: boolean) => void;
  isLoading: boolean;
}

const MessageList = ({
  data,
  index,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  userData,
  online,
  setActiveStatus,
  isLoading,
}: MessageListProps) => {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const userId = data.members.find((member) => member !== me);
  const { data: userDataQuery, error: userError } = useGetUserQuery(userId, {
    skip: !userId || isLoading,
  });

  useEffect(() => {
    setActiveStatus(online);
    if (userDataQuery?.user) {
      setUserData(userDataQuery.user);
    }
    if (userError) {
      const serverError = userError as ServerError;
      const errorMessage =
        serverError.data?.message || serverError.message || "Failed to load user information";
      toast.error(errorMessage);
    }
  }, [userDataQuery, userError, online, setActiveStatus, setUserData]);

  const handleClick = (id: string) => {
    navigate(`/dashboard-messages?${id}`);
    setOpen(true);
    setActive(index);
    setCurrentChat(data);
    setUserData(userDataQuery?.user || null);
    setActiveStatus(online);
  };

  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={() => handleClick(data._id)}
    >
      <div className="relative">
        <img
          src={userData?.avatar?.url || "https://via.placeholder.com/50"}
          alt=""
          className="w-[50px] h-[50px] rounded-full"
        />
        <div
          className={`w-[12px] h-[12px] rounded-full absolute top-[2px] right-[2px] ${
            online ? "bg-green-400" : "bg-[#c7b9b9]"
          }`}
        />
      </div>
      <div className="pl-3">
        <h1 className="text-[18px]">{userData?.name || "Unknown User"}</h1>
        <p className="text-[16px] text-[#000c]">
          {!isLoading && data.lastMessageId !== userData?._id
            ? "You:"
            : userData?.name?.split(" ")[0] + ": "}
          {data.lastMessage || "No messages yet"}
        </p>
      </div>
    </div>
  );
};

interface SellerInboxProps {
  setOpen: (open: boolean) => void;
  newMessage: string;
  setNewMessage: (message: string) => void;
  sendMessageHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  messages: Message[];
  sellerId: string;
  userData: User;
  activeStatus: boolean;
  scrollRef: React.RefObject<HTMLDivElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setMessages: (messages: Message[]) => void;
}

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  scrollRef,
  handleImageUpload,
}: SellerInboxProps) => {
  return (
    <div className="w-full min-h-full flex flex-col justify-between p-5">
      <div className="w-full flex p-3 items-center justify-between bg-slate-200">
        <div className="flex">
          <img
            src={userData.avatar?.url || "https://via.placeholder.com/60"}
            alt=""
            className="w-[60px] h-[60px] rounded-full"
          />
          <div className="pl-3">
            <h1 className="text-[18px] font-[600]">{userData.name}</h1>
            <h1>{activeStatus ? "Active Now" : ""}</h1>
          </div>
        </div>
        <AiOutlineArrowRight
          size={20}
          className="cursor-pointer"
          onClick={() => setOpen(false)}
        />
      </div>

      <div className="px-3 h-[65vh] py-3 overflow-y-scroll">
        {messages.map((item, index) => (
          <div
            key={index}
            className={`flex w-full my-2 ${
              item.sender === sellerId ? "justify-end" : "justify-start"
            }`}
            ref={scrollRef}
          >
            {item.sender !== sellerId && (
              <img
                src={userData.avatar?.url || "https://via.placeholder.com/40"}
                className="w-[40px] h-[40px] rounded-full mr-3"
                alt=""
              />
            )}
            {item.images?.url && (
              <img
                src={item.images.url}
                className="w-[300px] h-[300px] object-cover rounded-[10px] mr-2"
                alt=""
              />
            )}
            {item.text && (
              <div>
                <div
                  className={`w-max p-2 rounded ${
                    item.sender === sellerId ? "bg-[#000]" : "bg-[#38c776]"
                  } text-[#fff] h-min`}
                >
                  <p>{item.text}</p>
                </div>
                <p className="text-[12px] text-[#000000d3] pt-1">
                  {format(item.createdAt)}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <form
        className="p-3 relative w-full flex justify-between items-center"
        onSubmit={sendMessageHandler}
      >
        <div className="w-[30px]">
          <input
            type="file"
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer" size={20} />
          </label>
        </div>
        <div className="w-full">
          <input
            type="text"
            required
            placeholder="Enter your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={`${styles.input}`}
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={20}
              className="absolute right-4 top-5 cursor-pointer"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;