import Tabs from "@components/helpers/ui/Tabs";
import AuthLayout from "@components/layout/AuthLayout";
import cx from "classnames";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useRouter } from "next/router";

interface Props {
  children: any
}

type Route = 'cef' | 'sites' | 'products' | 'users' | 'cartography' | 'campaigns' | 'entry-tags';

const SiteProductLayout = ({
  children
}: Props) => {

  const router = useRouter();

  let currentRoute: Route;
  switch (router.pathname) {
    case '/userSettings/custom-emission-factors':
      currentRoute = 'cef';
      break;
  
    case '/userSettings/sites':
      currentRoute = 'sites';
      break;

    case '/userSettings/users':
      currentRoute = 'users';
      break;

    case '/userSettings/cartography':
      currentRoute = 'cartography';
      break;

    case '/userSettings/campaigns':
      currentRoute = 'campaigns';
      break;
    
    case '/userSettings/entry-tags':
      currentRoute = 'entry-tags';
      break;

    default:
      currentRoute = 'products';
      break;
  }

  const changeRoute = (route: Route) => {
    let path: string;
    switch (route) {
      case 'cef':
        path = '/userSettings/custom-emission-factors';
        break;
      case 'sites':
        path = '/userSettings/sites';
        break;
      case 'users':
        path = '/userSettings/users';
        break;
      case 'cartography':
        path = '/userSettings/cartography';
        break;
      case 'campaigns':
        path = '/userSettings/campaigns';
        break;
      case 'entry-tags':
        path = '/userSettings/entry-tags';
        break;
      default:
        path = '/userSettings/products'
        break;
    }
    router.push(path);
  }

  return (
    <AuthLayout>
      <div className="page-header">
        <p className={cx("title-1 color-1")}>{upperFirst(t("settings.settings"))}</p>
        <Tabs
          tabItems={[
            { label: upperFirst(t("site.sites")), value: "sites" },
            { label: upperFirst(t("product.products")), value: "products" },
            { label: upperFirst(t("user.users")), value: "users" },
            { label: upperFirst(t("tag.tags")), value: "entry-tags" },
            { label: upperFirst(t("cef.cefs")), value: "cef" },
            { label: upperFirst(t("cartography.cartography")), value: "cartography" },
            { label: upperFirst(t("campaign.campaigns")), value: "campaigns" },
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

export default SiteProductLayout;
