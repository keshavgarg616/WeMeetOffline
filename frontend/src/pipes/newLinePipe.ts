import { Pipe, PipeTransform } from "@angular/core";
import { SafeHtml } from "@angular/platform-browser";

@Pipe({
	name: "newLineHTML",
})
export class NewLineHTMLPipe implements PipeTransform {
	transform(value: string): SafeHtml {
		return value.replace(/\n/g, "<br>");
	}
}
