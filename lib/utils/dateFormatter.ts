import { LANGUAGE } from "@lib/translation/config/Locale";
import i18next from "i18next";

const monthsSwitchLanguage = {
  [LANGUAGE.FR]: [
    "Jan",
    "Fév",
    "Mar",
    "Avr",
    "Mai",
    "Juin",
    "Juil",
    "Août",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  [LANGUAGE.EN]: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

export const formatDayDate = (date: Date | undefined): string | undefined => {
  const getLanguage = i18next.languages[0] as LANGUAGE;
  const monthShort = monthsSwitchLanguage[getLanguage];

  if (!date) {
    return;
  }
  const day = date.getDate();
  const dayString = day < 10 ? `0${day}` : `${day}`;

  const month = date.getMonth();
  const monthString = monthShort[month];

  return `${dayString} ${monthString} ${date.getFullYear()}`;
};
