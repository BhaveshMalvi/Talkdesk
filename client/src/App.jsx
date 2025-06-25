import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectRoute from './components/auth/ProtectRoute'
import { LayoutLoader } from './components/layout/Loaders'
import { server } from './constants/config';
import axios from "axios"
import { useDispatch, useSelector } from 'react-redux';
import { userExists, userNotExists } from './redux/reducers/auth';
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from './socket';


const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const Groups = lazy(() => import('./pages/Groups'))
const NotFound = lazy(() => import('./pages/NotFound'))

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ChatManagement = lazy(() => import('./pages/admin/ChatManagement'))
const MessageMenagement = lazy(() => import('./pages/admin/MessageMenagement'))
const UserManagement = lazy(() => import('./pages/admin/UserManagement'))



const App = () => {

  const { user, loader } = useSelector(state => state.auth)

  const dispatch = useDispatch();



  useEffect(() => {
    axios.get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => (
        // console.log("1", data.user),
         dispatch(userExists(data.user))))
      .catch(() => dispatch(userNotExists()))
  }, [])



  return loader ? <LayoutLoader /> : (

    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          <Route element={
            <SocketProvider>
              <ProtectRoute user={user} />
            </SocketProvider>
          }>
            <Route path="/" element={<Home />}></Route>
            <Route path="/chat/:chatId" element={<Chat />}></Route>
            <Route path="/groups" element={<Groups />}></Route>
          </Route>

          <Route path="/login" element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>
          }>
          </Route>

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users' element={<UserManagement />} />
          <Route path='/admin/chats' element={<ChatManagement />} />
          <Route path='/admin/messages' element={<MessageMenagement />} />


          <Route path='*' element={<NotFound />} />


        </Routes>
      </Suspense>
      <Toaster position='bottom-center' />
    </BrowserRouter>
  )
}

export default App