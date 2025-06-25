import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
 
import React, { useState } from 'react'
import UserItem from '../shared/UserItem'
import { useInputValidation } from '6pp'
import { setIsNewGroup } from '../../redux/reducers/misc'
import { useDispatch, useSelector } from 'react-redux'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import toast from 'react-hot-toast'


const NewGroup = () => {


  const {isError, isLoading, error, data} = useAvailableFriendsQuery()

  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)

  const {isNewGroup} = useSelector((state) => state.misc)
  console.log('isNewGroup', isNewGroup)
  const [selectedMembers, setselectedMembers] = useState([])
    const dispatch = useDispatch()
  
    const errors = [{
      isError,
      error
    }]
    useErrors(errors)


  const  SelectMemberHadler=(id) => {
    setselectedMembers((prev) => prev.includes(id) ? prev.filter(currentElm => currentElm !== id) : [...prev, id])
  }


  console.log('selectedMembers', selectedMembers)

  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    if(selectedMembers.length < 2) return toast.error("Please select Atlest 3 members");

    newGroup("Creating new Group...",{name: groupName.value, members: selectedMembers})

    closeHandler()
      
    
  }


  const closeHandler = () =>  {
    dispatch(setIsNewGroup(false))

  }


  




  const groupName = useInputValidation("")

  return (
    <Dialog onClose={closeHandler} open={isNewGroup} >
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant='h4'>New Group</DialogTitle>
        <TextField label = "Group Name" value={groupName.value} onChange={groupName.changeHandler} />
        <Typography variant='body1' justifyContent={"space-between"}>
          Members
        </Typography>

        <Stack>
          {
             isLoading ? <Skeleton /> :
           ( data?.friends?.map((i) => (
              <UserItem user={i} key={i._id} handler={SelectMemberHadler} isAdded={selectedMembers.includes(i._id)} />
            )))
          }
        </Stack>

          <Stack direction={"row"} justifyContent={"space-evenly"}>
            <Button variant='outlined' color='error' size='large' onClick={closeHandler}>
              Cancle
            </Button>
            <Button variant='contained' size='large' onClick={submitHandler} disabled={isLoadingNewGroup}>
              Create
            </Button>
          </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup