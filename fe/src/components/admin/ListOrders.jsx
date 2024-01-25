import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useGetAllProductsQuery } from "../../redux/api/products";
import Admin from "../layout/Admin";
import {
  useGetOrdersForAdminQuery,
  useDeleteOrderMutation,
} from "../../redux/api/orders";

const ListOrders = () => {
  const { data, isLoading, error } = useGetOrdersForAdminQuery();
  const [
    deleteOrder,
    {
      isSuccess: isDeleteSuccess,
      error: deleteError,
      isLoading: isDeleteLoading,
    },
  ] = useDeleteOrderMutation();

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Payment Status",
          field: "paymentStatus",
          sort: "asc",
        },
        {
          label: "Order Status",
          field: "orderStatus",
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

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        paymentStatus: order?.paymentInfo?.status.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link
              to={`/admin/orders/${order?._id}`}
              className="btn btn-outline-primary"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            <button
              className="btn btn-outline-danger ms-2"
              onClick={() => deleteProductHandler(order._id)}
              disabled={isDeleteLoading}
            >
              <i className="fa fa-trash"></i>
            </button>
          </>
        ),
      });
    });

    return orders;
  };

  const deleteProductHandler = (id) => {
    deleteOrder(id);
  };

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (deleteError) toast.error(error?.data?.message);
    if (isDeleteSuccess) toast.success("Order deleted");
  }, [error, deleteError, isDeleteSuccess]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="All Products" />
      <Admin>
        <div>
          <h1 className="my-5">{data?.orders?.length} Orders</h1>
          <MDBDataTable
            data={setOrders()}
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

export default ListOrders;
