import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getMessages, getUserForSidebar, markMessagesAsSeen, sendMessagesToSelectedUser } from "../controllers/messageController.js";


const messageRouter=express.Router();

messageRouter.get('/users',protectRoute,getUserForSidebar);
messageRouter.get('/:id',protectRoute,getMessages);


messageRouter.put('/mark/:id',protectRoute,markMessagesAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessagesToSelectedUser)


export {messageRouter};