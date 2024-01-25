import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { usersAPI } from './users';

export const authAPI = createApi({
  reducerPath: 'authAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/auth' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => {
        return {
          url: '/login',
          method: 'POST',
          body,
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(usersAPI.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    register: builder.mutation({
      query: (body) => {
        return {
          url: '/register',
          method: 'POST',
          body,
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          await dispatch(usersAPI.endpoints.getMe.initiate(null));
        } catch (error) {
          console.log(error);
        }
      }
    }),
    logout: builder.query({
      query: () => '/logout',
    }),
    forgotPassword: builder.mutation({
      query(body) {
        return {
          url: '/password/forgot',
          method: 'POST',
          body,
        }
      }
    }),
    resetPassword: builder.mutation({
      query({ token, body }) {
        return {
          url: `/password/reset/${token}`,
          method: 'PUT',
          body,
        }
      }
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLazyLogoutQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authAPI;