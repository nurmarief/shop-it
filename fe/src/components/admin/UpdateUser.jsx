import React, { useState, useEffect } from "react";
import Admin from "../layout/Admin";
import MetaData from "../layout/MetaData";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetUserDetailsForAdminQuery,
  useUpdateUserMutation,
} from "../../redux/api/users";
import toast from "react-hot-toast";

const UpdateUser = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const { isLoading, error, data } = useGetUserDetailsForAdminQuery(params.id);

  const [updateUser, { error: updateError, isSuccess: isUpdateSuccess }] =
    useUpdateUserMutation();

  useEffect(() => {
    if (data?.user) {
      setEmail(data?.user?.email);
      setName(data?.user?.name);
      setRole(data?.user?.role);
    }
    if (error || updateError) toast.error(error?.data?.message);
    if (isUpdateSuccess) {
      toast.success("Update success");
      navigate("/admin/users");
    }
  }, [data, error, updateError, isUpdateSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    const updateData = { email, name, role };
    updateUser({ id: params?.id, body: updateData });
  };

  return (
    <>
      <MetaData title="Update User" />
      <Admin>
        <div className="row wrapper">
          <div className="col-10 col-lg-8">
            <form className="shadow-lg" onSubmit={submitHandler}>
              <h2 className="mb-4">Update User</h2>

              <div className="mb-3">
                <label htmlFor="name_field" className="form-label">
                  Name
                </label>
                <input
                  type="name"
                  id="name_field"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email_field" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="role_field" className="form-label">
                  Role
                </label>
                <select
                  id="role_field"
                  className="form-select"
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <button type="submit" className="btn update-btn w-100 py-2">
                Update
              </button>
            </form>
          </div>
        </div>
      </Admin>
    </>
  );
};

export default UpdateUser;
