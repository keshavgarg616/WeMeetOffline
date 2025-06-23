import Event from "../schemas/eventSchema.js";

export const addEvent = async (req, res) => {
	const {
		title,
		description,
		beginsAt,
		endsAt,
		isVirtual,
		address,
		tags,
		timezone,
		imgUrl,
	} = req.body;

	const userId = req.userId;

	try {
		const existingEvent = await Event.findOne({ title });
		if (existingEvent) {
			return res
				.status(400)
				.json({ error: "Event with this title already exists" });
		}

		const newEvent = new Event({
			title,
			description,
			beginsAt,
			endsAt,
			isVirtual,
			address,
			tags,
			organizerId: userId,
			timezone,
			attendeeIds: [],
			picture: imgUrl,
		});

		await newEvent.save();
		res.status(201).json({
			message: "Event created successfully",
			event: newEvent,
		});
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getEvents = async (req, res) => {
	try {
		const events = await Event.find()
			.populate("organizerId", "name email")
			.populate("attendeeIds", "name email")
			.sort({ beginsAt: 1 }); // Sort by beginning time
		res.status(200).json(events);
	} catch (error) {
		console.error("Error fetching events:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const deleteEvent = async (req, res) => {
	const { eventId } = req.params;
	const userId = req.userId;

	try {
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}

		if (event.organizerId.toString() !== userId) {
			return res.status(403).json({ error: "Unauthorized action" });
		}

		await Event.findByIdAndDelete(eventId);
		res.status(200).json({ message: "Event deleted successfully" });
	} catch (error) {
		console.error("Error deleting event:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getEventById = async (req, res) => {
	const { eventId } = req.params;

	try {
		const event = await Event.findById(eventId)
			.populate("organizerId", "name email")
			.populate("attendeeIds", "name email");
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}
		res.status(200).json(event);
	} catch (error) {
		console.error("Error fetching event:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
export const updateEvent = async (req, res) => {
	const eventId = req.body.eventId;
	const userId = req.userId;
	const updateData = req.body;

	try {
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}
		if (event.organizerId.toString() !== userId) {
			return res.status(403).json({ error: "Unauthorized action" });
		}
		// Validate beginsAt and endsAt
		if (updateData.beginsAt && updateData.endsAt) {
			const beginsAt = new Date(updateData.beginsAt);
			const endsAt = new Date(updateData.endsAt);
			if (beginsAt >= endsAt) {
				return res
					.status(400)
					.json({ error: "Event end time must be after start time" });
			}
		}
		// Update the event
		const updatedEvent = await Event.findByIdAndUpdate(
			eventId,
			{ ...updateData, organizerId: userId },
			{ new: true, runValidators: true }
		);
		res.status(200).json({
			message: "Event updated successfully",
			event: updatedEvent,
		});
	} catch (error) {
		console.error("Error updating event:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const registerForEvent = async (req, res) => {
	const { eventId } = req.params;
	const userId = req.userId;

	try {
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}
		if (event.attendeeIds.includes(userId)) {
			return res
				.status(400)
				.json({ error: "Already registered for this event" });
		}
		event.attendeeIds.push(userId);
		await event.save();
		res.status(200).json({
			message: "Registered for event successfully",
			event,
		});
	} catch (error) {
		console.error("Error registering for event:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const unregisterFromEvent = async (req, res) => {
	const { eventId } = req.params;
	const userId = req.userId;

	try {
		const event = await Event.findById(eventId);
		if (!event) {
			return res.status(404).json({ error: "Event not found" });
		}
		if (!event.attendeeIds.includes(userId)) {
			return res
				.status(400)
				.json({ error: "Not registered for this event" });
		}
		event.attendeeIds = event.attendeeIds.filter(
			(id) => id.toString() !== userId
		);
		await event.save();
		res.status(200).json({
			message: "Unregistered from event successfully",
			event,
		});
	} catch (error) {
		console.error("Error unregistering from event:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
