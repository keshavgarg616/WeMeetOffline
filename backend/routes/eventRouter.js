import { Router } from "express";
import {
	addEvent,
	deleteEvent,
	getEventById,
	getEvents,
	updateEvent,
	registerForEvent,
	unregisterFromEvent,
} from "../controllers/eventController.js";
import verifyToken from "../middleware.js";

const eventRouter = Router();

eventRouter.post("/add-event", verifyToken, addEvent);
eventRouter.post("/get-events", verifyToken, getEvents);
eventRouter.post("/delete-event", verifyToken, deleteEvent);
eventRouter.post("get-event-by-id", verifyToken, getEventById);
eventRouter.post("/update-event", verifyToken, updateEvent);
eventRouter.post("/register-for-event", verifyToken, registerForEvent);
eventRouter.post("/unregister-from-event", verifyToken, unregisterFromEvent);

export default eventRouter;
