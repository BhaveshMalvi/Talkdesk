import { useInfiniteScrollTop } from '6pp'
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material'
import { IconButton, Skeleton, Stack } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import { TypingLoader } from '../components/layout/Loaders'
import MessageComponent from '../components/shared/MessageComponent'
import { InputBox } from '../components/styles/StyledComponents.js'
import { grayColor, orange } from '../constants/color'
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, START_TYPING, STOP_TYPING } from '../constants/events'
import FileMenu from '../dialogs/FileMenu'
import { useErrors, useSocketEvents } from '../hooks/hook'
import { useChatDetailesQuery, useGetMessagesQuery } from '../redux/api/api'
import { removeNewMessagesAlert } from '../redux/reducers/chat'
import { setIsFileMenu } from '../redux/reducers/misc'
import { getSocket } from '../socket'


// const user = {
//   _id: "jsojojv",
//   name: "Bhavesh Malvi"
// }

const Chat = ({ chatId, user }) => {


  const containerRef = useRef(null)
  const bottomRef = useRef(null)
  const navigate = useNavigate()

  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [page, setPage] = useState(1)
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null)

  const [iamTyping, setIamTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)


  const typingTimeOut = useRef(null)

  const dispatch = useDispatch()

  const socket = getSocket()

  const chatDetails = useChatDetailesQuery({ chatId, skip: !chatId })
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page })

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(containerRef, oldMessagesChunk.data?.totalPages, page, setPage, oldMessagesChunk.data?.message)

  const members = chatDetails.data?.chat?.members;


  const messageOnChange = (e) => {
    setMessage(e.target.value)

    if (!iamTyping) {
      socket.emit(START_TYPING, { members, chatId })
      setIamTyping(true)
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current)

    typingTimeOut.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId })
      setIamTyping(false)
    }, [2000])
  }

  // const allMessages = [...oldMessagesChunk.data.message, ...messages]
  // console.log(members)


  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error }
  ]

  // console.log('oldMessages', oldMessages)

  useErrors(errors)

  // console.log("errors", oldMessagesChunk, errors )


  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true))
    setFileMenuAnchor(e.currentTarget)
  }


  const submitHandler = (e) => {
    e.preventDefault()
    if (!message.trim()) return;


    // Emmiting the message to the server
    socket.emit(NEW_MESSAGE, { chatId, members, message })
    setMessage("")

  }


  useEffect(() => {
    socket.emit(CHAT_JOINED, {userId: user._id, members})
    dispatch(removeNewMessagesAlert(chatId))

    return () => {
      setMessages([])
      setOldMessages([])
      setMessage("")
      setPage(1)
      socket.emit(CHAT_LEAVED, {userId:user._id, members})
    }
  }, [chatId])


  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages])


  useEffect(() => {
    if (!chatDetails.data?.chat) return navigate("/")
  }, [chatDetails.data])


  const newMessagesListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    console.log(data)
    setMessages((prev) => [...prev, data.message])
  }, [chatId])


  const startTyplingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    console.log(data)
    // setMessages((prev) => [...prev, data.message])
    console.log('start- typing')
    setUserTyping(true)
  }, [chatId])


  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    console.log(data)
    // setMessages((prev) => [...prev, data.message])
    console.log('stop- typing')
    setUserTyping(false)
  }, [chatId])

  const alertListener = useCallback((data) => {

    if (data.chatId !== chatId) return;

    const messageForAlert = {
      content: data.message,
      sender: {
        _id: "qwerssdffdsdfgfsdfg",
        name: "Admin",
      },
      chat: chatId,
      createdAt: new Date().toISOString()
    };
    setMessages((prev) => [...prev, messageForAlert])
  }, [chatId])

  const eventHandler = {
    [NEW_MESSAGE]: newMessagesListener,
    [ALERT]: alertListener,
    [START_TYPING]: startTyplingListener,
    [STOP_TYPING]: stopTypingListener
  }
  useSocketEvents(socket, eventHandler)


  const allMessages = [...oldMessages, ...messages]


  return chatDetails.isLoading ? <Skeleton /> : (
    <>

      <Stack ref={containerRef} boxSizing={"border-box"} padding={"1rem"} spacing={"1rem"} bgcolor={grayColor}  
      height={" calc(90vh - 64px)"}  sx={{
        overflow: "hidden",
        overflowY: "auto",
        
      }}
      >
        {
          allMessages.map((i) => (
            <MessageComponent key={i._id} message={i} user={user} />
          ))
        }

        {
          userTyping &&
          <div style={{ display: "flex", position: "sticky", justifyContent: "center", bottom: "0" }}> <TypingLoader /></div>
        }

        <div ref={bottomRef} />

      </Stack>

      <form style={{
        height: "10vh"
      }}
        onSubmit={submitHandler}
      >

        <Stack direction={"row"} height={"100%"} padding={"1rem"} alignItems={"center"} position={"relative"}>
          <IconButton sx={{ position: "absolute", left: "1.5rem", rotate: "30deg" }} onClick={handleFileOpen}>
            <AttachFileIcon />
          </IconButton>

          <InputBox placeholder="Type Messages Here..." value={message} onChange={messageOnChange} />

          <IconButton type='submit' sx={{ rotate: "-30deg", bgcolor: orange, color: "white", marginLeft: "1rem", padding: "0.5rem", "&:hover": { bgcolor: "error.dark" } }}>
            <SendIcon />
          </IconButton>
        </Stack>

      </form>

      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />

    </>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export default AppLayout()(Chat)