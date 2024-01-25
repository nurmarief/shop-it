import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsAPI = createApi({
  reducerPath: 'productsAPI',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/v1/' }),
  tagTypes: ['Product', 'AdminProducts', 'Reviews'],
  endpoints: (builder) => ({
    // all
    getProducts: builder.query({
      query: (params) => ({
        url: '/products',
        params: {
          page: params?.page,
          keyword: params?.keyword,
          "price[gte]": params?.min,
          "price[lte]": params?.max,
          category: params.category,
          ratings: params.ratings,
        }
      })
    }),
    // user
    getProductDetails: builder.query({
      query: (id) => ({
        url: `/products/${id}`
      }),
      providesTags: ['Product']
    }),
    submitReview: builder.mutation({
      query: ({ id, body }) => ({
        url: `/products/${id}/reviews`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product']
    }),
    canUserReview: builder.query({
      query: (id) => `/products/${id}/can-review`,
    }),
    getProductReviews: builder.query({
      query: (id) => `/products/${id}/reviews`,
      providesTags: ['Reviews'],
    }),
    // admin
    getDashboardSales: builder.query({
      query: ({ startDate, endDate }) => `/admin/orders/get-sales?start_date=${startDate}&end_date=${endDate}`,
    }),
    getAllProducts: builder.query({
      query: () => '/admin/products/',
      providesTags: ['AdminProducts'],
    }),
    addProduct: builder.mutation({
      query: (body) => ({
        url: '/admin/products/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminProducts'],
    }),
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminProducts', 'Product'],
    }),
    uploadProductImages: builder.mutation({
      query: ({ id, body }) => ({
        url: `/admin/products/${id}/images/add`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminProducts', 'Product'],
    }),
    deleteProductImage: builder.mutation({
      query: ({ productId, body }) => ({
        url: `/admin/products/${productId}/images/delete`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['AdminProducts', 'Product'],
    }),
    deleteProduct: builder.mutation({
      query: ({ productId }) => ({
        url: `/admin/products/${productId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AdminProducts'],
    }),
    deleteProductReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `/admin/products/${productId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useSubmitReviewMutation,
  useCanUserReviewQuery,
  useLazyGetDashboardSalesQuery,
  useGetAllProductsQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useUploadProductImagesMutation,
  useDeleteProductImageMutation,
  useDeleteProductMutation,
  useLazyGetProductReviewsQuery,
  useDeleteProductReviewMutation
} = productsAPI;