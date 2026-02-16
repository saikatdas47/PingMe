import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try {
        if (!fullName || !email || !password || !bio) {
            return res.status(400).json({ success: false, message: "missingDetails" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(409).json({ success: false, message: "Already SignedUp" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            bio,
        });

        const token = generateToken(newUser._id);

        const userData = newUser.toObject();
        delete userData.password;

        return res.status(201).json({
            success: true,
            userData,
            token,
            message: "Account Created Successfully",
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "missingDetails" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No Account, You need to SignUp First",
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: "Wrong Password" });
        }

        const token = generateToken(user._id);

        const userData = user.toObject();
        delete userData.password;

        return res.status(200).json({
            success: true,
            userData,
            token,
            message: "Loggedin Successfully",
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
};

// controller to check if user is authenticated
const checkAuth = (req, res) => {
    // 5) don't expose password (in case your middleware attaches full user)
    const userData = req.user?.toObject ? req.user.toObject() : { ...req.user };
    if (userData) delete userData.password;

    return res.status(200).json({ success: true, user: userData });
};

const updateProfile = async (req, res) => {
    try {
        const { profilePic, bio, fullName } = req.body;

        const userId = req.user._id;

        let updatedUser;

        if (!profilePic) {
            updatedUser = await User.findByIdAndUpdate(userId, { bio, fullName }, { new: true })
        }
        else {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(userId, { profilePic: upload.secure_url, bio, fullName }, { new: true })
        }

        return res.status(200).json({
            success: true,
            userData: updatedUser,
            message: "Profile Updated Successfully",
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
};

// 2) export updateProfile too
export { signup, login, checkAuth, updateProfile };