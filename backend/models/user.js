import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    avatar: { type: String, required: true },
    password: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    role: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

export default User;
