import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAsyncMutation } from '../../hooks/hook.jsx'
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api.js'
import { setIsSearch } from '../../redux/reducers/misc'
import UserItem from '../shared/UserItem'

const SearchDialog = () => {

  const search = useInputValidation("")

  const { isSearch } = useSelector(state => state.misc)
  const dispatch = useDispatch()

  const [searchUser] = useLazySearchUserQuery()

  const [users, setUsers] = useState([])
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(useSendFriendRequestMutation);
  // let isLoadingSendFriendRequest = false;
  // const [sendFriendRequest] = useSendFriendRequestMutation();

// console.log("=======", users)
  const addFriendHandler = async (id) => {
    console.log(id);

     await sendFriendRequest("Sending friend request...", {userId: id})

    // try {

    //     const resp = await sendFriendRequest({userId: id});
    //     console.log("Resp", resp);
        
    //     if (resp.data) {
    //       toast.success("Friend request sent");
    //       console.log(resp.data);
    //     } else {
    //       toast.error(resp?.error?.data?.message||"Something went wrong")
    //       console.log(resp.error.data.message)

    //     }
    // } catch (error) {
    //   console.log(error)
    //   toast.error("Something went wrong")
    // }
  }


  const searchCloseHandler = () => dispatch(setIsSearch(false))

  useEffect(() => {

    const timeOutId = setTimeout(() => {
      searchUser(search.value).then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e))
    }, 1000)
    return () => {
      clearInterval(timeOutId)
    }
  }, [search.value])



  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}> Find People</DialogTitle>
        <TextField label="" value={search.value} onChange={search.changeHandler} variant='outlined' size='small' InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <SearchIcon />
            </InputAdornment>
          )
        }} />

        <List>
          {
            users.map((i) => (
              <UserItem user={i} key={i._id} handler={addFriendHandler} handlerIsLoading={isLoadingSendFriendRequest} />
            ))
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default SearchDialog