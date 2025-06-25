import { AppBar, Backdrop, Badge, Box, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { lazy, Suspense, useState } from 'react'
import { orange } from '../../constants/color'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { server } from '../../constants/config';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { userNotExists } from '../../redux/reducers/auth';
import { setIsMobile, setIsNotification, setIsSearch, setIsNewGroup } from '../../redux/reducers/misc.js';
import { resetNotificationCount } from '../../redux/reducers/chat.js';
import LogoImage from '../../assets/LogoApp.png'


const SearchDialog = lazy(() => import("../specific/Search"))
const NotificationDialog = lazy(() => import("../specific/Notifications"))
const NewGroupDialog = lazy(() => import("../specific/NewGroup"))

const Header = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()


    const { isSearch, isNotification, isNewGroup } = useSelector(state => state.misc)
    const { notificationCount } = useSelector(state => state.chat)

    // const [isNewGroup, setIsNewGroup] = useState(false)

    const handleMobile = () => {
        dispatch(setIsMobile(true))
    }

    const OpenSearchDialog = () => {
        dispatch(setIsSearch(true))
    }

    const OpenNotification = () => {
        dispatch(setIsNotification(true))
        dispatch(resetNotificationCount())
    }


    const OpenNewGroup = () => {
        // setIsNewGroup((prev) => !prev)
        dispatch(setIsNewGroup(true))
        console.log('group view')
    }
    const NavigateGroup = () => {
        navigate("/groups")
    }
    const LogoutHandler = async () => {
        console.log("Logout");
        try {
            const data = await axios.get(`${server}/api/v1/user/logout`, { withCredentials: true })
            dispatch(userNotExists())
            toast.success(data.message)

        } catch (error) {
            toast.error(error?.response?.data?.message || "Something want wrong")
        } navigate("/groups")
    }
    return (
        <>
            <Box sx={{ flexGrow: 1 }} height={"4rem"}>
                <AppBar
                    position='static'
                    sx={{
                        bgcolor: orange
                    }}
                >
                    <Toolbar>
                        <Stack  sx={{
                            display: { xs: "none", sm: "block" },
                        }}>
                            <img
                                src={LogoImage}
                                alt={"Talkdesk"}
                                loading="lazy"
                                height={30}
                            />
                        </Stack >
                        <Box
                            sx={{
                                display: { xs: "block", sm: "none" }
                            }}
                        >

                            <IconButton color='inherit' onClick={handleMobile}>
                                <MenuIcon />
                            </IconButton>

                        </Box>
                        <Box
                            sx={{
                                flexGrow: 1
                            }} />
                        <Box>
                            <IconBtn
                                title="Search.."
                                onClick={OpenSearchDialog}
                                icon={<SearchIcon />}
                            />
                            <IconBtn
                                title="New Group"
                                onClick={OpenNewGroup}
                                icon={<AddIcon />}
                            />
                            <IconBtn
                                title="Manage Groups"
                                onClick={NavigateGroup}
                                icon={<GroupIcon />}
                            />
                            <IconBtn
                                title="Notifications"
                                onClick={OpenNotification}
                                icon={<NotificationsIcon />}
                                value={notificationCount}
                            />
                            <IconBtn
                                title="Logout"
                                onClick={LogoutHandler}
                                icon={<LogoutIcon />}
                            />



                        </Box>

                    </Toolbar>
                </AppBar>
            </Box>

            {isSearch && (
                <Suspense fallback={<Backdrop open />}>
                    <SearchDialog />
                </Suspense>
            )}
            {isNotification && (
                <Suspense fallback={<Backdrop open />}>
                    <NotificationDialog />
                </Suspense>
            )}
            {isNewGroup && (
                <Suspense fallback={<Backdrop open />}>
                    <NewGroupDialog />
                </Suspense>
            )}

        </>
    )
}


const IconBtn = ({ title, icon, onClick, value }) => {
    return (
        <Tooltip title={title}>
            <IconButton color='inherit' size='large' onClick={onClick}>
                {
                    value ? <Badge badgeContent={value} color='error'>{icon}</Badge> : icon
                }
            </IconButton>
        </Tooltip>
    )
}



export default Header