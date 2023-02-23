import { LANGUAGE } from "@lib/translation/config/Locale";
import i18next, { t } from "i18next";

// Contents switch language
import { CGVU_CONTENT_EN } from "./CgvuContents/CgvuContentEn";
import { CGVU_CONTENT_FR } from "./CgvuContents/CgvuContentFr";


const getCgvu = () => {
    const lang = i18next.language[0];
    switch (lang){
        case LANGUAGE.FR:
            return CGVU_CONTENT_FR;
            break;
        case LANGUAGE.EN:
            return CGVU_CONTENT_EN;
            break;
        default:
            return CGVU_CONTENT_FR;
            break;
    }
}

export { getCgvu };
