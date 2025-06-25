import { Button, Dialog, DialogTitle, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../constants/sampleData";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useAddGroupMembersMutation, useAvailableFriendsQuery } from "../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

const AddMemberDialog = ({chatId }) => {

    const dispatch = useDispatch()
    const {isAddMember} = useSelector((state) => state.misc)
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setselectedMembers] = useState([]);

    const [addMembers, isLoadingAddMembers] = useAsyncMutation(useAddGroupMembersMutation)
    const {isLoading, data, isError, error} = useAvailableFriendsQuery(chatId)
  

    useErrors([{
      isError, error
    }])

  const SelectMemberHadler = (id) => {
    setselectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElm) => currentElm !== id)
        : [...prev, id]
    );
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding Members....", {members: selectedMembers, chatId})
    closeHandler()

  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false))
  };

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          { isLoading ? <Skeleton /> : data?.friends?.length > 0 ? (
             data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={SelectMemberHadler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            cancle
          </Button>
          <Button
            onClick={addMemberSubmitHandler}
            variant="contained"
            disabled={isLoadingAddMembers}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
