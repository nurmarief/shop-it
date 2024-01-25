import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../redux/api/products";
import Admin from "../layout/Admin";

const ListProducts = () => {
  const { data, isLoading, error } = useGetAllProductsQuery();
  const [
    deleteProduct,
    {
      isSuccess: isDeleteSuccess,
      isLoading: isDeleteLoading,
      error: deleteError,
    },
  ] = useDeleteProductMutation();

  const setProducts = () => {
    const products = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Stock",
          field: "stock",
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

    data?.products?.forEach((product) => {
      products.rows.push({
        id: product?._id,
        name: `${product?.name?.substring(0, 20)}...`,
        stock: product?.stock,
        actions: (
          <>
            <Link
              to={`/admin/products/${product?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <Link
              to={`/admin/products/${product?._id}/upload-images`}
              className="btn btn-outline-success ms-2"
            >
              <i className="fa fa-image"></i>
            </Link>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteProductHandler(product._id)}
              disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return products;
  };

  const deleteProductHandler = (id) => {
    deleteProduct({ productId: id });
  };

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (deleteError) toast.error(error?.data?.message);
    if (isDeleteSuccess) toast.success("Item deleted");
  }, [error, deleteError, isDeleteSuccess]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="All Products" />
      <Admin>
        <div>
          <h1 className="my-5">{data?.products?.length} Products</h1>
          <MDBDataTable
            data={setProducts()}
            className="px-3"
            bordered
            stripped="true"
            hover
          />
        </div>
      </Admin>
    </>
  );
};

export default ListProducts;
