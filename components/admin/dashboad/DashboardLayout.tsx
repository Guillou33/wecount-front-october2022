import cx from 'classnames';
import AuthLayout from '@components/layout/AuthLayout';
import { useRouter } from 'next/router';
import _, { upperFirst } from 'lodash';
import Tabs from "@components/helpers/ui/Tabs";
import { t } from 'i18next';

interface Props {
  children: any;
}

type Route = 'company-list' | 'company-list-locked';

const DashboardLayout = ({ children }: Props) => {

  const router = useRouter();

  let currentRoute: Route;
  switch (router.pathname) {
    case '/admin/dashboard/company-list':
      currentRoute = 'company-list';
      break;
    case '/admin/dashboard/company-list-locked':
      currentRoute = 'company-list-locked';
      break;
    default:
      currentRoute = 'company-list';
      break;
  }

  const changeRoute = (route: Route) => {
    let path: string;
    switch (route) {
      case 'company-list':
        path = '/admin/dashboard/company-list';
        break;
      case 'company-list-locked':
        path = '/admin/dashboard/company-list-locked';
        break;
      default:
        path = '/admin/dashboard/company-list';
        break;
    }
    router.push(path);
  }

  return (
    <AuthLayout>
      <div className="page-header">
        <p className={cx("title-1 color-1")}>
          {upperFirst(t("dashboard.dashboard"))} {upperFirst(t("user.role.title.admin"))}
        </p>
        <Tabs
          tabItems={[
            { label: upperFirst(t("company.companies")), value: 'company-list' },
            { label: upperFirst(t("company.block.blockedCompanies")), value: 'company-list-locked' },
          ]}
          value={currentRoute}
          onChange={changeRoute}
        />
      </div>
      <div className="page-content-wrapper pt-4">{children}</div>
    </AuthLayout>
  )
}


export default DashboardLayout;