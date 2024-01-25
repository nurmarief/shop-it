import React from 'react';
import { Route } from 'react-router-dom';
import ProtectedRoute from '../auth/ProtectedRoute';
import Dashboard from '../admin/Dashboard';
import ListProducts from '../admin/ListProducts';
import NewProduct from '../admin/NewProduct';
import UpdateProduct from '../admin/UpdateProduct';
import UploadImages from '../admin/UploadImages';
import ListOrders from '../admin/ListOrders';
import ProcessOrder from '../admin/ProcessOrder';
import ListUsers from '../admin/ListUsers';
import UpdateUser from '../admin/UpdateUser';
import ProductReviews from '../admin/ProductReviews';

const adminRoutes = () => {
  return (
    <>
      <Route
        path="/admin/dashboard/"
        element={
          <ProtectedRoute admin>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/"
        element={
          <ProtectedRoute admin>
            <ListProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/new"
        element={
          <ProtectedRoute admin>
            <NewProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id"
        element={
          <ProtectedRoute admin>
            <UpdateProduct />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/products/:id/upload-images"
        element={
          <ProtectedRoute admin>
            <UploadImages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/"
        element={
          <ProtectedRoute admin>
            <ListOrders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders/:id"
        element={
          <ProtectedRoute admin>
            <ProcessOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/"
        element={
          <ProtectedRoute admin>
            <ListUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users/:id"
        element={
          <ProtectedRoute admin>
            <UpdateUser />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute admin>
            <ProductReviews />
          </ProtectedRoute>
        }
      />
    </>
  )
}

export default adminRoutes