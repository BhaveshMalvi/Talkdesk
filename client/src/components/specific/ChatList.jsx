import { Stack } from '@mui/material'
import { bgGradient } from '../../constants/color'
import ChatItem from '../shared/ChatItem'


const ChatList = ({ w = "100%", chats = [], chatId, onlineUsers = [], newMessagesAlert = [{
    chatId: "",
    count: 0
}],
    handleDeleteChat,
}) => {

    // console.log('count', newMessagesAlert)
    console.log('isOnline ===', onlineUsers)
    return (
        <Stack 
        // width={w}
         direction={"column"} overflow={"auto"} sx={{backgroundImage:bgGradient}}>
            {
                chats?.map((data, index) => {
                    const { _id, avatar, name, groupChat, members } = data
                    const newMessageAlert = newMessagesAlert.find(
                        ({ chatId }) => chatId === _id
                    )
                   const isOnline = members?.some(member => onlineUsers.includes(member));
                    console.log("isOnline", isOnline, _id);
                    
                    
                    return <ChatItem index={index} newMessageAlert={newMessageAlert} isOnline={isOnline} avatar={avatar} name={name} _id={_id} key={_id} groupChat={groupChat} sameSender={chatId === _id} handleDeleteChat={handleDeleteChat} />
                })
            }

        </Stack>
    )
}

export default ChatList 