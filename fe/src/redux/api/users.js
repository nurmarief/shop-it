import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser, setIsAuthenticated, setIsLoading } from '../features/userSlice';

export const usersAPI = createApi({
  reducerPath: 'usersAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/' }),
  tagTypes: ['User', 'AdminUsers', 'AdminUser'],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => '/me',
      transformResponse: (result) => result.user,
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
          dispatch(setIsAuthenticated(true));
          dispatch(setIsLoading(false));
        } catch (error) {
          dispatch(setIsLoading(false));
          console.log(error);
        }
      },
      providesTags: ['User'],
    }),
    updateMe: builder.mutation({
      query(body) {
        return {
          url: '/me/update',
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: ['User'],
    }),
    uploadAvatar: builder.mutation({
      query(body) {
        return {
          url: '/me/upload-avatar',
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: ['User'],
    }),
    updatePassword: builder.mutation({
      query(body) {
        return {
          url: '/me/update-password',
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: ['User'],
    }),
    myOrders: builder.query({
      query: () => '/me/orders',
    }),
    // admin
    getUsersForAdmin: builder.query({
      query: () => `/admin/users`,
      providesTags: ['AdminUsers'],
    }),
    getUserDetailsForAdmin: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: ['AdminUser'],
    }),
    updateUser: builder.mutation({
      query({ id, body }) {
        return {
          url: `/admin/users/${id}`,
          method: 'PUT',
          body,
        }
      },
      invalidatesTags: ['AdminUsers', 'AdminUser'],
    }),
    deleteUser: builder.mutation({
      query(id) {
        return {
          url: `/admin/users/${id}`,
          method: 'DELETE',
        }
      },
      invalidatesTags: ['AdminUsers'],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadAvatarMutation,
  useUpdatePasswordMutation,
  useMyOrdersQuery,
  useGetUsersForAdminQuery,
  useGetUserDetailsForAdminQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersAPI;