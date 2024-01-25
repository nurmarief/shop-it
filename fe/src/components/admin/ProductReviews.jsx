import React, { useState, useEffect } from "react";
import Admin from "../layout/Admin";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-hot-toast";
import {
  useDeleteProductReviewMutation,
  useLazyGetProductReviewsQuery,
} from "../../redux/api/products";

const ProductReviews = () => {
  const [productId, setProductId] = useState("");
  const [getProductReview, { data, isLoading, error }] =
    useLazyGetProductReviewsQuery();
  const [
    deleteProductReview,
    {
      error: deleteError,
      isLoading: isDeleteLoading,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteProductReviewMutation();

  const setReviews = () => {
    const reviews = {
      columns: [
        {
          label: "Review ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Rating",
          field: "rating",
          sort: "asc",
        },
        {
          label: "Comment",
          field: "comment",
          sort: "asc",
        },
        {
          label: "User",
          field: "user",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.reviews?.forEach((review) => {
      reviews.rows.push({
        id: review?._id,
        rating: review?.rating,
        comment: review?.comment,
        user: review?.user?.name,
        actions: (
          <>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteReviewHandler(review._id)}
              disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return reviews;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    getProductReview(productId);
  };

  const deleteReviewHandler = (id) => {
    deleteProductReview({ productId, reviewId: id });
  };

  useEffect(() => {
    if (error || deleteError) toast.error(error?.data?.message);
    if (isDeleteSuccess) toast.success("Review deleted");
  }, [error, deleteError, isDeleteSuccess]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="Product Reviews" />
      <Admin>
        <div className="row justify-content-center my-5">
          <div className="col-6">
            <form onSubmit={submitHandler}>
              <div className="mb-3">
                <label htmlFor="productId_field" className="form-label">
                  Enter Product ID
                </label>
                <input
                  type="text"
                  id="productId_field"
                  className="form-control"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>

              <button
                id="search_button"
                type="submit"
                className="btn btn-primary w-100 py-2"
              >
                SEARCH
              </button>
            </form>
          </div>
        </div>

        {data?.reviews?.length > 0 ? (
          <MDBDataTable
            data={setReviews()}
            className="px-3"
            bordered
            stripped="true"
            hover
          />
        ) : (
          <p className="mt-5 text-center">No Reviews</p>
        )}
      </Admin>
    </>
  );
};

export default ProductReviews;
