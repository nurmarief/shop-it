import React, { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Loader from '../layout/Loader';
import { MDBDataTable } from 'mdbreact';
import { Link } from 'react-router-dom';
import MetaData from '../layout/MetaData';
import Admin from '../layout/Admin';
import { useDeleteUserMutation, useGetUsersForAdminQuery } from '../../redux/api/users';

const ListUsers = () => {
  const { data, isLoading, error } = useGetUsersForAdminQuery();
  const [deleteUser, {
    error: deleteError,
    isLoading: isDeleteLoading,
    isSuccess: isDeleteSuccess,
  }] = useDeleteUserMutation();

  const setUsers = () => {
    const users = {
      columns: [
        {
          label: 'ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
        },
        {
          label: 'Role',
          field: 'role',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    data?.users?.forEach((user) => {
      users.rows.push({
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        actions: (
          <>
            <Link to={`/admin/users/${user?._id}`} className="btn btn-outline-primary" >
              <i className="fa fa-pencil" ></i>
            </Link>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteUserHandler(user._id)}
              disabled={isDeleteLoading}
            >
              <i className="fa fa-trash" ></i>
            </button>
          </>
        )
      })
    })

    return users;
  };

  const deleteUserHandler = (id) => {
    deleteUser(id);
  };

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (deleteError) toast.error(error?.data?.message);
    if (isDeleteSuccess) toast.success('User deleted');
  }, [error, deleteError, isDeleteSuccess]);

  if (isLoading) return <Loader />

  return (
    <>
      <MetaData title="All Users" />
      <Admin>
        <div>
          <h1 className="my-5">{data?.users?.length} Users</h1>
          <MDBDataTable
            data={setUsers()}
            className="px-3"
            bordered
            stripped
            hover
          />
        </div>
      </Admin>
    </>
  )
}

export default ListUsers;