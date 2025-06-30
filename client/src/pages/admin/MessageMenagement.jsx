import { Avatar } from "@mui/material";
import { Box, Stack } from "@mui/system";
import moment from "moment";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors, useFetchData } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileFormat(url);
            console.log("1212", url, file);

            return (
              <Box
              >
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{ alignItems:"center", justifyContent:"center", display:"flex" }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Send By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    width: 220,
    headerClassName: "table-header",
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    width: 150,
    headerClassName: "table-header",
  },
  {
    field: "createdAt",
    headerName: "Time",
    width: 250,
    headerClassName: "table-header",
  },
];

const MessageMenagement = () => {
  const [rows, setRows] = useState([]);


  
    const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/messages`,
    "messages",
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
      setRows(
      data?.messsages.map((i) => ({
        ...i,
        id: i._id,
        sender: {
          name: i.sender.name,
          avatar: transformImage(i.sender.avatar, 50),
        },
        createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
      }))
    );
  }
  }, [data]);

  return (
    <AdminLayout>
      <Table
        heading={"All Messages"}
        columns={columns}
        rows={rows}
        rowHeight={200}
      />
    </AdminLayout>
  );
};

export default MessageMenagement;
