import process from 'node:process';
import mongoose from 'mongoose';
import ProductModel from '../models/product.js';
import products from './data.js';

const populateProductsDb = async () => {
  const DB_URI = '';
  try {
    await mongoose.connect(DB_URI);
    await ProductModel.deleteMany();

    console.log('[POPULATE PRODUCT DB] Products are deleted');
    await ProductModel.insertMany(products);
    console.log('[POPULATE PRODUCT DB] Products are inserted');
    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
}

populateProductsDb();
