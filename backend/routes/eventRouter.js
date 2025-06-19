import { Router } from "express";
import {
	addEvent,
	deleteEvent,
	getEventById,
	getEvents,
	updateEvent,
	registerForEvent,
	unregisterFromEvent,
} from "../controllers/eventController";
const eventRouter = Router();

eventRouter.post("/add-event", addEvent);
eventRouter.post("/get-events", getEvents);
eventRouter.post("/delete-event", deleteEvent);
eventRouter.post("get-event-by-id", getEventById);
eventRouter.post("/update-event", updateEvent);
eventRouter.post("/register-for-event", registerForEvent);
eventRouter.post("/unregister-from-event", unregisterFromEvent);

export default eventRouter;
