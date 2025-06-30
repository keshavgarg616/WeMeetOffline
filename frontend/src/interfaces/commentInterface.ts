import { User } from "./userInterface";
import { Reply } from "./replyInterface";

export interface Comment {
	user: User;
	text: string;
	replies?: Reply[];
	_id: string;
}
