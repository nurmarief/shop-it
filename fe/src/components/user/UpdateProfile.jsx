import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useUpdateMeMutation } from '../../redux/api/users';
import User from '../layout/User';
import MetaData from '../layout/MetaData';

const UpdateProfile = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [updateMe, { isLoading, error, isSuccess, data }] = useUpdateMeMutation();
  const user = useSelector(state => state.auth.user);

  useEffect(() => {
    if (user) {
      setEmail(user?.email);
      setName(user?.name);
    }
    if (error) toast.error(error?.data?.message);
    if (isSuccess) {
      toast.success(data?.message);
      navigate('/me/profile')
    }
  }, [user, error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    const updateData = { email, name };
    updateMe(updateData);
  }

  return (
    <>
      <MetaData title="Update Profile" />
      <User>
        <div className="row wrapper">
          <div className="col-10 col-lg-8">
            <form
              className="shadow rounded bg-body"
              onSubmit={submitHandler}
            >
              <h2 className="mb-4">Update Profile</h2>

              <div className="mb-3">
                <label htmlFor="name_field" className="form-label"> Name </label>
                <input
                  type="text"
                  id="name_field"
                  className="form-control"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email_field" className="form-label"> Email </label>
                <input
                  type="email"
                  id="email_field"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="btn update-btn w-100" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </User>
    </>
  )
}

export default UpdateProfile