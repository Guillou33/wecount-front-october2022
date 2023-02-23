import { Remarkable } from "remarkable";

export const markDownReaderInside = (data: string) => {
    let md = new Remarkable();
    md.set({
        html: true,
        breaks: false,
        linkify: true
    });
    let mdParsedToHtml = md.render(data);

    return mdParsedToHtml;
}