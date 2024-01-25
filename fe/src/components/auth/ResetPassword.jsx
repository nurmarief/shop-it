import React, { useState, useEffect } from 'react'
import { useResetPasswordMutation } from '../../redux/api/auth';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';

const ResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');

  const [resetPassword, { isLoading, error, isSuccess }] = useResetPasswordMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (isAuthenticated) navigate('/');
    if (isSuccess) {
      toast.success('Reset password success');
      navigate('/login');
    };
  }, [error, isAuthenticated, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmedPassword) return toast.error('Password does not match');

    const token = params?.token
    const body = { password, confirmedPassword };
    resetPassword({ token, body });
  }

  return (
    <>
      <MetaData title="Reset Password" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">New Password</h2>

            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="confirm_password_field" className="form-label"
              >Confirm Password</label
              >
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                name="confirm_password"
                value={confirmedPassword}
                onChange={e => setConfirmedPassword(e.target.value)}
              />
            </div>

            <button
              id="new_password_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? "Updating password..." : "Set Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default ResetPassword