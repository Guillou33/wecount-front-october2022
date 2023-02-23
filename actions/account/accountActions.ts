import { AccountTypes } from "@actions/account/types";
import { LANGUAGE } from "@lib/translation/config/Locale";

export type Action = RequestChangeLanguageAction;

export interface RequestChangeLanguageAction {
  type: AccountTypes.ACCOUNT_CHANGE_LANGUAGE_REQUESTED;
  payload: {
    language: LANGUAGE;
  };
}

export const requestChangeLanguage = ({
  language,
}: {
  language: LANGUAGE;
}): RequestChangeLanguageAction => {
  return {
    type: AccountTypes.ACCOUNT_CHANGE_LANGUAGE_REQUESTED,
    payload: {
      language,
    },
  };
};
