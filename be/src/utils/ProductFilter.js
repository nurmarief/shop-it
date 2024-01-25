class ProductFilter {
  constructor({ collectionToBeQueried, queryStr }) {
    this.collectionToBeQueried = collectionToBeQueried;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: 'i',
      }
    } : {};

    this.collectionToBeQueried = this.collectionToBeQueried.find({ ...keyword });
    return this;
  }

  filter() {
    let queryStrCopy = { ...this.queryStr };
    const fieldsToRemove = ['keyword', 'page'];
    fieldsToRemove.forEach((field) => delete queryStrCopy[field]);

    let stringifedQueryStr = JSON.stringify(queryStrCopy);
    stringifedQueryStr = stringifedQueryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    queryStrCopy = JSON.parse(stringifedQueryStr);

    this.collectionToBeQueried = this.collectionToBeQueried.find(queryStrCopy);
    return this;
  }

  pagination({ productsPerPage }) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skipNumOfItems = productsPerPage * (currentPage - 1);
    this.collectionToBeQueried = this.collectionToBeQueried.limit(productsPerPage).skip(skipNumOfItems);
    return this;
  }
};

export default ProductFilter;
