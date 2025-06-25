import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { lazy, memo, Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from '../components/layout/Loaders';
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/StyledComponents.js";
import { bgGradient, matBlack } from "../constants/color";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import { useChatDetailesQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveMemberMutation, useRenameGroupMutation } from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";


const ConfirmDeleteDialogFor = lazy(() =>
  import("../dialogs/ConfirmDeleteDialog")
);

const AddMemberDialog = lazy(() =>
  import("../dialogs/AddMemberDialog")
);

// const isAddMember = true;



const Groups = () => {


  const navigate = useNavigate();
  const myGroups = useMyGroupsQuery('');


  // const chatId = useSearchParams()[0].get("group");
  const chatId = useSearchParams()[0].get("group")

  // console.log(chatId, "================1111111", typeof chatId)

  const groupDetails = useChatDetailesQuery({ chatId, populate: true }, { skip: !chatId })
  const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveMemberMutation)
  const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isEdit, setIsEdit] = useState();
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  // const [isAddMember, setIsAddMember] = useState(false)
  const [members, setMemebers] = useState([])


  const { isAddMember } = useSelector((state) => state.misc)
  const dispatch = useDispatch()


  // const members = groupDetails?.data?.chat?.members || []

  console.log("groupDetails", groupDetails?.data)


  const errors = [{
    isError: myGroups.isError,
    error: myGroups.error,
  },
  {
    isError: groupDetails.isError,
    error: groupDetails.error,
  }]


  useErrors(errors)

  console.log('====', groupDetails)





  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false);
    updateGroup("Updating Group Name...", {
      chatId,
      name: groupNameUpdatedValue
    })
    // console.log("update group name");
  };

  console.log("chatId", chatId);

  const openConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };
  const CloseConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };


  const deleteHandler = () => {
    deleteGroup("Deleting...", chatId)
    CloseConfirmDeleteHandler()
    navigate("/groups")
  }

  const openAddMemberHandler = () => {
    dispatch(setIsAddMember(true))

  };

  const removeMemerHandler = (userId) => {
    removeMember("Removeing Member....", { chatId, userId })

  }

  useEffect(() => {
    if (groupDetails.data) {
      console.log(groupDetails.data)
      setGroupName(groupDetails.data.chat?.name)
      setGroupNameUpdatedValue(groupDetails.data.chat?.name)
      setMemebers(groupDetails.data.chat?.members)
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedValue("")
      setMemebers([])
      setIsEdit(false)
    }
  }, [groupDetails.data])


  useEffect(() => {
   
    return () => {
      if (!chatId) { // Only clear if no group is selected (e.g., navigating away from any group)
        setGroupName("");
        setGroupNameUpdatedValue("");
        setMemebers([]);
        setIsEdit(false);
      }
    };
  }, [chatId]);



  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: matBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      alignContent={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedValue}
            onChange={(e) => setGroupNameUpdatedValue(e.target.value)}
          />
          <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <>
      <Stack
        direction={{ sm: "row", xs: "column-reverse" }}
        spacing={"1rem"}
        p={{ sm: "1rem", xs: "0", md: "1rem 4rem" }}
      >
        <Button
          size="large"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={openConfirmDeleteHandler}
        >
          Delete Group
        </Button>
        <Button
          size="large"
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddMemberHandler}
        >
          Add Member
        </Button>
      </Stack>
    </>
  );

  return myGroups.isLoading ? <LayoutLoader /> : (
    <Grid container height={"100vh"} >
      <Grid
        item
        sm={4}
        bgcolor={"bisque"}
        sx={{ display: { xs: "none", sm: "block" }, backgroundImage: bgGradient }}
        overflow={"auto"}
      >
        <GroupsList myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}

        {chatId && (
          <>
            {GroupName}

            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>

            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              // bgcolor={"bisque"}
              height={"50vh"}
              overflow={"auto"}
            >
              {/* members  */}

              {
                isLoadingRemoveMember ? <CircularProgress /> : members.map((i) => (
                  <UserItem user={i} key={i._id} isAdded styling={{
                    boxShadow: " 0 0 0.5rem rgba(0,0,0,0.2)",
                    padding: "1rem 2rem",
                    borderRadius: "1rem"
                  }}
                    handler={removeMemerHandler}
                  />
                ))
              }



            </Stack>

            {ButtonGroup}
          </>
        )}
      </Grid>


      {
        isAddMember &&
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      }


      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          {" "}
          <ConfirmDeleteDialogFor
            open={confirmDeleteDialog}
            handleClose={CloseConfirmDeleteHandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{ display: { xs: "block", sm: "none" } }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupsList w="50vw" myGroups={myGroups?.data?.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

// eslint-disable-next-line react/prop-types
const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w} sx={{ backgroundImage: bgGradient, height: "100vh" }} >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No groups
        </Typography>
      )}
    </Stack>
  );
};

// eslint-disable-next-line react/display-name, react/prop-types
const GroupListItem = memo(({ group, chatId }) => {
  // eslint-disable-next-line react/prop-types
  const { name, avatar, _id } = group;




  return (
    <Link
      to={`?group=${_id}`}
      onClick={() => {
        // if (chatId == _id) return e.preventDefault();
        console.log("121212", _id, chatId, group);

      }}
    >
      <Stack
        direction={"row"}
        spacing={"1rem"}
        margin={"1rem"}
        alignItems={"center"}
      >
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Groups;
