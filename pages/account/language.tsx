import Head from "next/head";
import requireAuth from "@components/hoc/auth/requireAuth";
import Language from "@components/account/Language";
import { t } from "i18next";
import { upperFirst } from "lodash";

const LanguagePage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("user.account.myAccount"))} - {upperFirst(t("user.language"))}</title>
      </Head>
      <Language />
    </>
  );
};

export default requireAuth(LanguagePage);
