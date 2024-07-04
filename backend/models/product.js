import mongoose from 'mongoose';

const { Schema } = mongoose;

const productSchema = new Schema({
    productName: { type: String, required: true },
    price: { type: Number, required: true },
    categories: { type: String, required: true },
    images: { type: String, required: true },
    id: { type: String, required: true },
});
const Product = mongoose.model('Product', productSchema);

export default Product;
