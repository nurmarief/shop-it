import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const paymentsAPI = createApi({
  reducerPath: 'paymentsAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/payments' }),
  endpoints: (builder) => ({
    stripeCheckoutSession: builder.mutation({
      query: (body) => ({
        url: `/checkout-session/`,
        method: 'POST',
        body,
      })
    }),
  }),
});

export const { useStripeCheckoutSessionMutation } = paymentsAPI;