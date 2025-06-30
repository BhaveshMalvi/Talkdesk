import { Avatar, Skeleton, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from '../../components/shared/AvatarCard';
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors, useFetchData } from "../../hooks/hook";
import { transformImage } from "../../lib/features";


const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => (<AvatarCard avatar={params.row.avatar} />)
  },
  {
    field: "name",
    headerName: "Name",
    width: 250,
    headerClassName: "table-header",
  },
  {
    field: "groupChat",
    headerName: "Group",
    width: 100,
    headerClassName: "table-header",
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    width: 250,
    headerClassName: "table-header",
  },
  {
    field: "member",
    headerName: "Members",
    width: 400,
    headerClassName: "table-header",
    renderCell: (params) => (<AvatarCard max={100} avatar={params.row.members} />)

  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    width: 230,
    headerClassName: "table-header",
  },
  {
    field: "creator",
    headerName: "Created By",
    width: 230,
    headerClassName: "table-header",
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];


const ChatManagement = () => {
  const [rows, setRows] = useState([]);

    const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/chats`,
    "chats",
    {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Include credentials (cookies) in the request
    }
  );




  useErrors([{
    isError: error,
    error: error
  }])

  console.log("data", data);

  useEffect(() => {
 if (data) {
     setRows(data.chats.map(i => ({
      ...i,
      id: i._id,
      avatar: i.avatar?.map(i => transformImage(i, 50)),
      members: i.member?.map(i => transformImage(i.avatar, 50))

    })))
 }
  }, [data]);

  return loading ? <Skeleton /> :   (
    <AdminLayout>
      <Table heading={"All Chats"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default ChatManagement;
