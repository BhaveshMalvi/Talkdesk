import { Avatar, Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
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
    renderCell: (params) => (<Avatar alt={params.row.name} src={params.row.avatar} />)
  },
  {
    field: "name",
    headerName: "Name",
    width: 250,
    headerClassName: "table-header",
  },
  {
    field: "username",
    headerName: "Username",
    width: 250,
    headerClassName: "table-header",
  },
  {
    field: "friends",
    headerName: "Friends",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "groups",
    headerName: "Groups",
    width: 230,
    headerClassName: "table-header",
  },
];



const UserManagement = () => {
  const [rows, setRows] = useState([]);

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "users",
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
      setRows(data?.users.map((i) => ({ ...i, id: i._id, avatar: transformImage(i.avatar, 50) })))
    }
  }, [data])

  return loading ? <Skeleton height={"100vh"} /> : (
    <AdminLayout>
      <Table heading={"All Users"} columns={columns} rows={rows} />
    </AdminLayout>
  );
};

export default UserManagement;
