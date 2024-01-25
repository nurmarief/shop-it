import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPriceQueryParams } from '../../helpers/helpers';
import { PRODUCT_CATEGORIES } from '../../constants/constants';
import StarRatings from "react-star-ratings";

const Filters = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();

  // Price filter input value
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    // Set price filter input to match the path's query
    searchParams.has('min') && setMin(searchParams.get('min'));
    searchParams.has('max') && setMax(searchParams.get('max'));
  }, []);

  const handleButtonClick = (e) => {
    e.preventDefault();

    // Set path's query to match price filter input
    searchParams = getPriceQueryParams(searchParams, 'min', min);
    searchParams = getPriceQueryParams(searchParams, 'max', max);

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };

  const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);

    // Prevent double checked checkbox
    checkboxes.forEach(item => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      // Delete filter from query
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      // Set new filter value if it already exists
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value);
      } else {
        // Append the value
        searchParams.append(checkbox.name, checkbox.value);
      }
      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  };

  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    // Set category checkbox to match the path's query
    const value = searchParams.get(checkboxType);
    if (checkboxValue === value) return true;
    return false;
  };

  return (
    <div className="border p-3 filter">
      <h3>Filters</h3>
      <hr />
      <h5 className="filter-heading mb-3">Price</h5>
      <form
        id="filter_form"
        className="px-2"
        action="your_action_url_here"
        method="get"
        onSubmit={handleButtonClick}
      >
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Min ($)"
              name="min"
              value={min}
              onChange={e => setMin(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Max ($)"
              name="max"
              value={max}
              onChange={e => setMax(e.target.value)}
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary">GO</button>
          </div>
        </div>
      </form>
      <hr />
      <h5 className="mb-3">Category</h5>
      {PRODUCT_CATEGORIES.map((category, index) => (
        <div key={index} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            id="check5"
            value={category}
            onClick={e => handleClick(e.target)}
            defaultChecked={defaultCheckHandler("category", category)}
          />
          <label className="form-check-label" for="check5"> {category} </label>
        </div>
      ))}
      <hr />
      <h5 className="mb-3">Ratings</h5>

      {
        [5, 4, 3, 2, 1].map((ratings, index) => (
          <div key={index} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              name="ratings"
              id="check7"
              value={ratings}
              onClick={e => handleClick(e.target)}
              defaultChecked={defaultCheckHandler("ratings", ratings.toString())}
            />
            <label className="form-check-label" for="check7">
              <StarRatings
                rating={ratings}
                starRatedColor="#ffb829"
                numberOfStars={ratings}
                name="ratings"
                starDimension="21px"
                starSpacing="1px"
              />
            </label>
          </div>
        ))
      }
    </div>
  )
}

export default Filters;