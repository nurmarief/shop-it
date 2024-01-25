import React, { useState, useEffect } from 'react';
import User from '../layout/User';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useUploadAvatarMutation } from '../../redux/api/users';
import { useSelector } from 'react-redux';
import MetaData from '../layout/MetaData';

const UploadAvatar = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar ? user?.avatar?.url : '/images/default_avatar.jpg'
  );
  const [uploadAvatar, { isLoading, error, isSuccess, data }] = useUploadAvatarMutation();

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (isSuccess) {
      toast.success(data?.message);
      navigate('/me/profile')
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    const updateData = { avatar };
    uploadAvatar(updateData);
  }

  const previewAvatarChangeHandler = (e) => {
    const avatar = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    }

    reader.readAsDataURL(avatar);
  }

  return (
    <>
      <MetaData title="Upload Avatar" />
      <User>
        <div className="row wrapper">
          <div className="col-10 col-lg-8">
            <form
              className="shadow rounded bg-body"
              onSubmit={submitHandler}
            >
              <h2 className="mb-4">Upload Avatar</h2>

              <div className="mb-3">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <figure className="avatar item-rtl">
                      <img src={avatarPreview} className="rounded-circle" alt="image" />
                    </figure>
                  </div>
                  <div className="input-foam">
                    <label className="form-label" htmlFor="customFile">
                      Choose Avatar
                    </label>
                    <input
                      type="file"
                      name="avatar"
                      className="form-control"
                      id="customFile"
                      accept="images/*"
                      onChange={previewAvatarChangeHandler}
                    />
                  </div>
                </div>
              </div>

              <button
                id="register_button"
                type="submit"
                className="btn w-100 py-2"
                disabled={isLoading}
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      </User>
    </>
  )
}

export default UploadAvatar