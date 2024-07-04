import mongoose from 'mongoose';

const { Schema } = mongoose;


const orderSchema = new Schema({
    orderId: { type: String, required: true },
    userId: { type: String, required: true },
    product: { type: productSchema, required: true },
    total: { type: Number, required: true },
    quantity: { type: Number, required: true },
    status: { type: String, required: true },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
