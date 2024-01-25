import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import StarRatings from "react-star-ratings";
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import NewReview from '../reviews/NewReview';
import ListReviews from '../reviews/ListReviews';
import NotFound from '../layout/NotFound';
import { setCartItem } from '../../redux/features/cartSlice';
import { useGetProductDetailsQuery } from '../../redux/api/products';

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const { data, isLoading, error, isError } = useGetProductDetailsQuery(productId);
  const product = data?.product;
  const { isAuthenticated } = useSelector(state => state.auth);
  const [activeImage, setActiveImage] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveImage(product?.images[0] ? product?.images[0]?.url : '/images/default_product.png');
  }, [product]);

  useEffect(() => {
    isError && toast.error(error?.data?.message);
  }, [isError]);

  const increaseQty = () => {
    const count = document.querySelector('.count');

    if (count.valueAsNumber >= product?.stock) return;

    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decreaseQty = () => {
    const count = document.querySelector('.count');

    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };

    dispatch(setCartItem(cartItem));

    toast.success('Item added to cart');
  };

  if (isLoading) return <Loader />
  if(error && error?.status === 404) return <NotFound />

  return (
    <>
      <MetaData title={product?.name} />
      <div className="row d-flex justify-content-around">
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-3">
            <img
              className="d-block w-100"
              src={activeImage}
              alt={product?.name}
              width="340"
              height="390"
            />
          </div>
          <div className="row justify-content-start mt-5">
            {product?.images?.map((image, index) => (
              <div key={index} className="col-2 ms-4 mt-2">
                <a role="button">
                  <img
                    className={`d-block border rounded p-3 cursor-pointer ${image.url === activeImage ? "border-warning" : ""}`}
                    height="100"
                    width="100"
                    src={image?.url}
                    alt={image?.url}
                    onClick={(e) => setActiveImage(image.url)}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5 mt-5">
          <h3>{product?.name}</h3>
          <p id={product?._id}>{product?._id}</p>
          <hr />

          <div className="d-flex">
            <StarRatings
              rating={product?.ratings}
              starRatedColor="#ffb829"
              numberOfStars={5}
              name="rating"
              starDimension="24px"
              starSpacing="1px"
            />
            <span id="no-of-reviews" className="pt-1 ps-2"> ({product?.numOfReviews} Reviews) </span>
          </div>
          <hr />

          <p id="product_price">${product?.price}</p>
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus" onClick={decreaseQty}>-</span>
            <input
              type="number"
              className="form-control count d-inline"
              value={quantity}
              readonly
              disabled
            />
            <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={product?.stock <= 0}
            onClick={setItemToCart}
          >
            Add to Cart
          </button>

          <hr />

          <p>
            Status: <span id="stock_status" className={product?.stock > 0 ? "greenColor" : "redColor"}>{product?.stock > 0 ? "In Stock" : "Out of stock"}</span>
          </p>

          <hr />

          <h4 className="mt-2">Description:</h4>
          <p>{product?.description}</p>
          <hr />
          <p id="product_seller mb-3">Sold by: <strong>{product?.seller}</strong></p>

          {isAuthenticated ? < NewReview productId={productId} /> :
            (<div className="alert alert-danger my-5" type="alert">
              Login to post your review.
            </div>)
          }
        </div>
        {product?.reviews?.length > 0 && <ListReviews reviews={product?.reviews} />}
      </div>
    </>
  )
}

export default ProductDetails