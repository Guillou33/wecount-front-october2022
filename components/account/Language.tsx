import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { Option, SelectOne } from "@components/helpers/ui/selects";
import i18n from "@lib/translation/config/i18n";
import { LANGUAGE } from "@lib/translation/config/Locale";
import { useEffect, useState } from "react";
import AccountLayout from "./AccountLayout";
import cx from "classnames";
import { useDispatch } from "react-redux";
import { requestChangeLanguage } from "@actions/account/accountActions";
import useTranslate from "@hooks/core/translation/useTranslate";
import { upperFirst } from "lodash";
import styles from "@styles/account/language.module.scss";
import { useRouter } from "next/router";

const Language = () => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const [selectedLanguage, setSelectedLanguage] = useState<LANGUAGE>(i18n.language as LANGUAGE);
  const [spinnerOn, setSpinnerOn] = useState<boolean>(false);

  const router = useRouter();

  const languageTranslated = {
    [LANGUAGE.FR]: upperFirst(t("global.adjective.language.french")),
    [LANGUAGE.EN]: upperFirst(t("global.adjective.language.english"))
  };

  const onChangeLanguage = (language: LANGUAGE) => {
    setSpinnerOn(true);
    dispatch(requestChangeLanguage({
      language
    }));
  };

  return (
    <AccountLayout>
      <div className={cx(styles.container)}>
        <SelectOne
          className={cx([styles.languageSelector])}
          selected={selectedLanguage}
          onOptionClick={(language) => {
            setSelectedLanguage(language);
          }}
        >
          {(ctx) => (
            <>
              {Object.values(LANGUAGE).map(
                (language) => (
                  <Option
                    {...ctx}
                    value={language}
                    key={language}
                  >
                    {languageTranslated[language]}
                  </Option>
                )
              )}
            </>
          )}
        </SelectOne>
        <ButtonSpinner
          onClick={() => onChangeLanguage(selectedLanguage)}
          type="button"
          className={cx(["button-2", styles.btnChangeLanguage])}
          disabled={selectedLanguage === i18n.language}
          spinnerOn={spinnerOn}
        >
          {upperFirst(t('global.modify'))}
        </ButtonSpinner>
      </div>
    </AccountLayout>
  );
};

export default Language;
