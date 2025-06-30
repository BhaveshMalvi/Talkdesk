/* eslint-disable react/prop-types */
import  { memo } from 'react'
import { Link } from '../styles/StyledComponents.js'
import { Box, Stack, Typography } from '@mui/material'
import AvatarCard from './AvatarCard'
import {delay, motion} from 'framer-motion'
import { useDispatch } from 'react-redux'
import { setIsMobile } from '../../redux/reducers/misc'


const ChatItem = ({
    avatar=[],
    name,
    _id,
    groupChat=false,
    sameSender,
    isOnline,
    newMessageAlert,
    handleDeleteChat,
    index=0
}) => {


 const dispatch = useDispatch()
 console.log('newMeessages', newMessageAlert?.count)
 console.log("isOnline", isOnline);
 
  

  return (
    <Link to={`/chat/${_id}`}  onContextMenu = {(e) => handleDeleteChat(e , _id, groupChat)} onClick={() =>  dispatch(setIsMobile(false))}>
     {/* <motion.div
        initial={{ opacity: 0, y: '-100%' }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.001 }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: sameSender ? 'black' : 'unset',
          color: sameSender ? 'white' : 'unset',
          position: 'relative',
        }} */}
      {/* > */}
        <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem',
          backgroundColor: sameSender ? 'black' : 'unset',
          color: sameSender ? 'white' : 'unset',
          position: 'relative'
        }}
        >

      

        
        <AvatarCard avatar={avatar} />

        <Stack>
            <Typography>{name}</Typography>
            {
                newMessageAlert && (
                    <Typography>{newMessageAlert.count} New Message</Typography>
                )
            }
        </Stack>

        {
            isOnline &&
             (
                <Box
                sx={{
                    width:"10px",
                    height:"10px",
                    borderRadius: "50%",
                    backgroundColor:"green",
                    position:"absolate",
                    top:"50%",
                    right:"1rem",
                    transform:"translateY(-50%)"
                }}
                />
            )
        }
             
        {/* </motion.div> */}
        </div>

    </Link>
  )
}

export default memo(ChatItem)