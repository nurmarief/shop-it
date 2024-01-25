import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ordersAPI = createApi({
  reducerPath: 'ordersAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/' }),
  tagTypes: ['Order', 'AdminOrders'],
  endpoints: (builder) => ({
    createNewOrder: builder.mutation({
      query: (body) => ({
        url: `/orders`,
        method: 'POST',
        body,
      })
    }),
    orderDetails: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: ['Order'],
    }),
    getOrdersForAdmin: builder.query({
      query: () => `/admin/orders`,
      providesTags: ['AdminOrders'],
    }),
    updateOrder: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/orders/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminOrders'],
    }),
  }),
});

export const {
  useCreateNewOrderMutation,
  useOrderDetailsQuery,
  useGetOrdersForAdminQuery,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersAPI;