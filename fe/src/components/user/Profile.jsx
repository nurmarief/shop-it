import React from 'react';
import { useSelector } from 'react-redux';
import User from '../layout/User';
import MetaData from '../layout/MetaData';

const Profile = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <>
      <MetaData title="Profile" />
      <User>
        <div className="row justify-content-around mt-5 user-info">
          <div className="col-12 col-md-3">
            <figure className="avatar avatar-profile">
              <img
                className="rounded-circle img-fluid"
                src={user?.avatar ? user?.avatar.url : "../images/default_avatar.jpg"}
                alt={user?.name}
              />
            </figure>
          </div>

          <div className="col-12 col-md-5">
            <h4>Full Name</h4>
            <p>{user?.name}</p>

            <h4>Email Address</h4>
            <p>{user?.email}</p>

            <h4>Joined On</h4>
            <p>{user?.createdAt.substring(0, 10)}</p>
          </div>
        </div>
      </User>
    </>
  )
}

export default Profile