import React from 'react';
import { Route } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import Profile from '../user/Profile';
import UpdateProfile from '../user/UpdateProfile';
import ProtectedRoute from '../auth/ProtectedRoute';
import UploadAvatar from '../user/UploadAvatar';
import UpdatePassword from '../user/UpdatePassword';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';
import Cart from '../cart/Cart';
import Shipping from '../cart/Shipping';
import ConfirmOrder from '../cart/ConfirmOrder';
import PaymentMethod from '../cart/PaymentMethod';
import MyOrders from '../order/MyOrders';
import OrderDetails from '../order/OrderDetails';
import Invoice from '../invoice/Invoice';
import ProductDetails from '../product/ProductDetails';
import Home from '../Home';

const userRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />
      <Route path="/products/:productId" element={<ProductDetails />} />
      <Route path="/login/" element={<Login />} />
      <Route path="/register/" element={<Register />} />
      <Route path="/password/forgot/" element={<ForgotPassword />} />
      <Route path="/password/reset/:token" element={<ResetPassword />} />
      <Route path='/cart' element={< Cart />} />
      <Route
        path="/me/profile/"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/me/update-profile/"
        element={
          <ProtectedRoute>
            <UpdateProfile />
          </ProtectedRoute>}
      />
      <Route
        path="/me/upload-avatar/"
        element={
          <ProtectedRoute>
            <UploadAvatar />
          </ProtectedRoute>}
      />
      <Route
        path="/me/update-password/"
        element={
          <ProtectedRoute>
            <UpdatePassword />
          </ProtectedRoute>}
      />
      <Route
        path='/me/orders'
        element={
          <ProtectedRoute>
            < MyOrders />
          </ProtectedRoute>
        } />
      <Route
        path='/me/orders/:id'
        element={
          <ProtectedRoute>
            < OrderDetails />
          </ProtectedRoute>
        } />
      <Route
        path='/shipping'
        element={
          <ProtectedRoute>
            < Shipping />
          </ProtectedRoute>
        } />
      <Route
        path='/confirm-order'
        element={
          <ProtectedRoute>
            < ConfirmOrder />
          </ProtectedRoute>
        } />
      <Route
        path='/payment-method'
        element={
          <ProtectedRoute>
            < PaymentMethod />
          </ProtectedRoute>
        } />
      <Route
        path='/invoice/orders/:id'
        element={
          <ProtectedRoute>
            < Invoice />
          </ProtectedRoute>
        } />
    </>
  )
}

export default userRoutes