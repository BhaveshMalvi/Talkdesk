import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../redux/reducers/misc'
import { Delete as DeleteIcon , ExitToApp as ExitToAppIcon} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../redux/api/api'

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {


    const navigate = useNavigate()

    const { isDeleteMenu, selectedDeletedChat } = useSelector((state) => state.misc)

    const [deleteChat, _ , deleteChatData] = useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup, __ , leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)
    const isGroup =  selectedDeletedChat.groupChat 

    // console.log("selectedDeletedChat", selectedDeletedChat);
    

    const closeHandler = () => {
        dispatch(setIsDeleteMenu(false))
        deleteMenuAnchor.current = null
    }

    const leaveGroupHandler = () => {
            closeHandler()
        leaveGroup("Leaveing chat...", selectedDeletedChat.chatId)
    }

    const deleteChatHandler = () => {
        closeHandler()
        deleteChat("Deleting chat...", selectedDeletedChat.chatId)
    }

    useEffect(() => {
        if(deleteChatData || leaveGroupData)  navigate("/")

    }, [deleteChatData, leaveGroupData])

    return (
        // eslint-disable-next-line react/prop-types
        <Menu open={isDeleteMenu} onClose={closeHandler} anchorEl={deleteMenuAnchor.current}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
            }}
            transformOrigin={{
                vertical: "center",
                horizontal: "center"
            }}

        >
            <Stack sx={{
                width: "10rem",
                padding: "0.5rem",
                cursor: "pointer"
            }}
                direction={"row"}
                alignContent={"center"}
                spacing={"0.5rem"}
                onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
            >
                {isGroup ? <><ExitToAppIcon /> <Typography>Leave Group</Typography></> : <><DeleteIcon /> <Typography>Delete Chat</Typography></>}
            </Stack>
        </Menu>

    )
}

export default DeleteChatMenu