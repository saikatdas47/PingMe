import Message from "../models/message.js";
import User from "../models/user.js";

import cloudinary from "../lib/cloudinary.js";

import {io,userSocketMap} from "../server.js"

const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;

        const filteredUser = await User.find({ _id: { $ne: userId } }).select("-password");

        const unseenMessages = {};

        await Promise.all(
            filteredUser.map(async (user) => {
                const count = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: userId,
                    seen: false,
                });

                if (count > 0) unseenMessages[user._id] = count;
            })
        );

        return res.status(200).json({
            success: true,
            users: filteredUser,
            unseenMessages,
        });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ],
        }).sort({ createdAt: 1 });

        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId, seen: false },
            { seen: true }
        );

        return res.status(200).json({ success: true, messages });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
};


//api to mark messages as seen using messages id
const markMessagesAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        const msg = await Message.findOneAndUpdate(
            id, { seen: true }
        );
        return res.status(200).json({ success: true });
    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
};


const sendMessagesToSelectedUser = async (req, res) => {

    try {
        const { text, image } = req.body;
const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;

        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        //emit the new msg to the recvr socket

        const receiverSocketId=userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.json({ success: true, newMessage });


    } catch (e) {
        console.log(e.message);
        return res.status(500).json({ success: false, message: e.message });
    }
}
export { getUserForSidebar, getMessages, markMessagesAsSeen, sendMessagesToSelectedUser };