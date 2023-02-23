export enum LOCALE {
  FR_FR = "fr-FR",
  EN_GB = "en-GB",
}

export enum LANGUAGE {
  FR = "fr",
  EN = "en",
}

export const defaultLocale = LOCALE.FR_FR;

export const convertLocaleToLanguage = (locale: LOCALE): LANGUAGE => {
  switch (locale) {
    case LOCALE.EN_GB:
      return LANGUAGE.EN;
    default:
      return LANGUAGE.FR;
  }
}

export const convertLanguageToLocale = (language: LANGUAGE) => {
  switch (language) {
    case LANGUAGE.EN:
      return LOCALE.EN_GB
    default:
      return LOCALE.FR_FR
  }
}
