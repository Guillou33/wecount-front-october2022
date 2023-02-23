import Tabs from "@components/helpers/ui/Tabs";
import AuthLayout from "@components/layout/AuthLayout";
import cx from "classnames";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useRouter } from "next/router";

interface Props {
  children: any
}

type Route = 'language';

const AccountLayout = ({
  children
}: Props) => {

  const router = useRouter();

  let currentRoute: Route;
  switch (router.pathname) {
    case '/account/language':
      currentRoute = 'language';
      break;

    default:
      currentRoute = 'language';
      break;
  }

  const changeRoute = (route: Route) => {
    let path: string;
    switch (route) {
      case 'language':
        path = '/account/language';
        break;
      default:
        path = '/account/language'
        break;
    }
    router.push(path);
  }

  return (
    <AuthLayout>
      <div className="page-header">
        <p className={cx("title-1 color-1")}>{upperFirst(t("user.account.myAccount"))}</p>
        <Tabs
          tabItems={[
            { label: upperFirst(t("user.language")), value: "language" },
          ]}
          value={currentRoute}
          onChange={changeRoute}
        />
      </div>
      <div className="page-content-wrapper">
        <div className="page-content">{children}</div>
      </div>
    </AuthLayout>
  );
};

export default AccountLayout;
