import { createContext, useMemo, useContext } from 'react'
import io from 'socket.io-client'
import { server } from './constants/config';




const SocketContect = createContext();

// eslint-disable-next-line react-hooks/rules-of-hooks
const getSocket = () => useContext(SocketContect)

// eslint-disable-next-line react/prop-types
const SocketProvider = ({children}) =>{

const socket = useMemo(() => io(server, {withCredentials: true}) , [])

    return (
        <SocketContect.Provider value={socket}>
            {children}
        </SocketContect.Provider>
    )
}


export {SocketProvider, getSocket}

