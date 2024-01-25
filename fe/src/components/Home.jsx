import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useGetProductsQuery } from '../redux/api/products';
import MetaData from './layout/MetaData';
import Loader from './layout/Loader';
import CustomPagination from './layout/CustomPagination';
import Filters from './layout/Filter';
import ProductItem from './product/ProductItem';

const Home = () => {
  let [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const keyword = searchParams.get('keyword') || '';
  const min = searchParams.get('min');
  const max = searchParams.get('max');
  const category = searchParams.get('category');
  const ratings = searchParams.get('ratings');

  // Request to server
  // Set up params
  let params = { page, keyword };
  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);
  const { data, isLoading, error, isError } = useGetProductsQuery(params);

  // UI
  const columnSize = keyword ? 4 : 3;

  useEffect(() => {
    isError && toast.error(error?.data?.message);
  }, [isError])

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={'Buy Best Products Online'} />
      <div className="row">
        {
          keyword && (
            <div className="col-6 col-md-3 mt-5">
              <Filters />
            </div>
          )
        }
        <div className={keyword ? "col-6 col-md-9" : "col-6 col-md-12"}>
          <h1 id="products_heading" className="text-secondary">
            {keyword ? `${data?.totalProductsFound} items found with keyword: ${keyword}` : 'Latest Products'}
          </h1>
          <section id="products" className="mt-5">
            <div className="row">
              {data?.productsFound?.map(product => (<ProductItem product={product} columnSize={columnSize} />))}
            </div>
          </section>
          <CustomPagination resPerPage={data?.productsPerPage} filteredProductCount={data?.totalProductsFound} />
        </div>
      </div>
    </>
  );
}

export default Home;