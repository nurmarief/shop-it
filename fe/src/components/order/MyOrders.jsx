import React, { useEffect } from "react";
import { useMyOrdersQuery } from "../../redux/api/users";
import { toast } from "react-hot-toast";
import Loader from "../layout/Loader";
import { MDBDataTable } from "mdbreact";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MetaData from "../layout/MetaData";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/features/cartSlice";

const MyOrders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, isLoading, error } = useMyOrdersQuery();
  const [searchParams] = useSearchParams();
  const orderSuccess = searchParams.get("order-success");

  const setOrders = () => {
    const orders = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Amount Paid",
          field: "amount",
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
        {
          label: "Payment Status",
          field: "status",
          sort: "asc",
        },
      ],
      rows: [],
    };

    data?.orders?.forEach((order) => {
      orders.rows.push({
        id: order?._id,
        amount: `$${order?.totalAmount}`,
        status: order?.paymentInfo?.status?.toUpperCase(),
        orderStatus: order?.orderStatus,
        actions: (
          <>
            <Link to={`/me/orders/${order?._id}`} className="btn btn-primary">
              <i className="fa fa-eye"></i>
            </Link>
            <Link
              to={`/invoice/orders/${order?._id}`}
              className="btn btn-success ms-2"
            >
              <i className="fa fa-print"></i>
            </Link>
          </>
        ),
      });
    });

    return orders;
  };

  useEffect(() => {
    if (error) toast.error(error?.data?.message);
    if (orderSuccess) {
      dispatch(clearCart());
      navigate("/me/orders");
    }
  }, [error, orderSuccess]);

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title="My Orders" />
      <div>
        <h1 className="my-5">{data?.orders?.length}</h1>
        <MDBDataTable
          data={setOrders()}
          className="px-3"
          bordered
          stripped="true"
          hover
        />
      </div>
    </>
  );
};

export default MyOrders;
