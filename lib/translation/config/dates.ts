import i18next from "i18next";
import moment from "moment";
import { LANGUAGE } from "./Locale";

export const formatDateWithLanguage = (dateTime: string) => {

    const getLanguage = i18next.languages[0];
    
    switch (getLanguage){
        case LANGUAGE.FR:
            return moment(dateTime).format("D MMM YYYY à HH:mm");
            break;
        case LANGUAGE.EN:
            return moment(dateTime).locale(getLanguage).format('MMMM Do YYYY, h:mm a');
            break;
        default:
            return moment(dateTime).format("D MMM YYYY à HH:mm");
            break;
    }
}