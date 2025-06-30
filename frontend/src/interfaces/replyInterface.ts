import { User } from "./userInterface";

export interface Reply {
	user: User;
	text: string;
	_id: string;
}
