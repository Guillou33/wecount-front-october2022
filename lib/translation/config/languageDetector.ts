import { LanguageDetectorAsyncModule } from 'i18next';
import { convertLocaleToLanguage, defaultLocale, LOCALE } from './Locale';
import AbstractAuthTokenManager from "@lib/wecount-api/AbstractAuthTokenManager";
import BrowserAuthTokenManager from '@lib/wecount-api/BrowserAuthTokenManager';
import ServerAuthTokenManager from '@lib/wecount-api/ServerAuthTokenManager';
import jwt from "jsonwebtoken";

export const guessLocale = async (): Promise<LOCALE> => {
  if (typeof window === "undefined") {
    return defaultLocale;
  }

  const tokenManager = new BrowserAuthTokenManager();
  const { jwtToken } = tokenManager.getAuthTokens();
  const decodedJwt = jwt.decode(jwtToken ?? '');
  if (
    typeof decodedJwt === "string" ||
    !decodedJwt?.locale
  ) {
    return defaultLocale;
  }
  return decodedJwt.locale as LOCALE;
}

const guessLanguage = async (): Promise<string> => {
  return convertLocaleToLanguage(await guessLocale());
}

const languageDetector: LanguageDetectorAsyncModule = {
    type: 'languageDetector',
    async: true,
    detect: async (callback: (locale: string) => any) => {
      const language = await guessLanguage();
      callback(language);
    },
    init: () => { },
    cacheUserLanguage: () => { },
};
export default languageDetector;