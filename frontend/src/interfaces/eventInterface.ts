import { User } from "./userInterface";

export interface Event {
	_id: string;
	title: string;
	description: string;
	beginsAt: Date;
	endsAt: Date;
	isVirtual: boolean;
	tags: string[];
	organizerId: User;
	timezone: string;
	picture: string;
	__v: number;
}
