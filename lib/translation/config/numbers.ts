import i18next from "i18next";
import { LANGUAGE } from "./Locale";

export const formatNumberWithLanguage = (value: number | undefined | null) => {
    if (!value || value === undefined) return "0";

    const getLanguage = i18next.languages[0];

    const localeLanguage = `${getLanguage}-${getLanguage.toUpperCase()}`;

    switch (getLanguage){
        case LANGUAGE.FR:
            return value.toLocaleString(localeLanguage).replace("-", () => value === 0 ? "" : "-");
            break;
        case LANGUAGE.EN:
            return value.toLocaleString(localeLanguage).replace("-", () => value === 0 ? "" : "-");
            break;
        default:
            return value.toLocaleString(localeLanguage).replace("-", () => value === 0 ? "" : "-");
            break;
    }

}