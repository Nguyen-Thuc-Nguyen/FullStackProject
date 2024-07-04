import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import upload from '../middleware/multer.js';
import cloudinary from '../config/cloudinaryConfig.js'; // Ensure cloudinary config is imported

const authRouter = express.Router();

// Register endpoint

authRouter.post('/register', async (req, res) => {
    console.log('Request body:', req.body); // Log the entire request body to debug

    const { email, fullName, avatar, password, dateOfBirth, role } = req.body;

    try {
        if (!email || !password || !fullName || !avatar || !dateOfBirth || !role) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            email,
            fullName,
            avatar,
            password: hashedPassword,
            dateOfBirth,
            role,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login endpoint
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload endpoint
authRouter.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);

        // Assuming the user's email is provided in the request body
        const userEmail = req.body.email;
        const user = await User.findOne({ email: userEmail });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.avatar = result.secure_url;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Uploaded!",
            data: result,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Error uploading image",
        });
    }
});

export default authRouter;
