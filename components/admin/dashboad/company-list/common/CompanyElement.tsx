import { askLockConfirmation, askUnlockConfirmation } from "@actions/admin/company-list/companyListActions";
import { Company } from "@reducers/admin/companyListReducer";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import cx from "classnames";
import styles from "@styles/admin/dashboard/company-list/common/companyElement.module.scss";
import useFoldable from "@hooks/utils/useFoldable";
import { formatDayDate } from "@lib/utils/dateFormatter";
import Switch from "@components/helpers/ui/Switch";
import { setReadOnlyModeRequested } from "@actions/admin/company-list/companyListActions";
import { adminImpersonate } from '@actions/auth/authActions';
import ApiClient from '@lib/wecount-api/ApiClient';
import { loginRedirect } from '@lib/core/auth/loginRedirect';
import { upperFirst } from "lodash";
import { t } from "i18next";


interface Props {
  company: Company;
  locked: boolean;
}

const CompanyElement = ({
  company,
  locked,
}: Props) => {

  const dispatch = useDispatch();
  const router = useRouter();

  const askLockToggle = locked ? askUnlockConfirmation : askLockConfirmation;

  const {
    isOpen,
    toggle,
    foldable,
  } = useFoldable();

  const usersRendered = (
    <ul>
      {company.users.map(user => {
        return (
          <li key={user.id} className={cx(styles.userLi)}>
            <p>
              {user.isManager && <strong>{upperFirst(t("user.role.title.admin"))} : </strong>}
              {user.email} ({user.passwordIsSet ? t("global.adjective.active.masc") : t("global.adjective.unactive.masc")}){" "}
              <button className={cx("button-2", styles.impersonateButton)} onClick={async ()=>{
                try {
                  await dispatch(adminImpersonate({ email: user.email }));
                  const apiClient = ApiClient.buildFromBrowser(false);
                  const redirectInfo = await loginRedirect(apiClient);
                  router.push(redirectInfo.path, redirectInfo.as);
                } catch (err) {
                  console.log(err);
                }
              }}>
                <i
                  className={cx("fas fa-sign-in-alt", styles.impersonateIcon)}
                />
              </button>
            </p>
          </li>
        );
      })}
    </ul>
  )

  const adminNb = company.users.filter(user => user.isAdmin).length;

  return (
    <div className={cx(styles.main)}>
      <div className={cx(styles.companyInfo)}>
        <p onClick={toggle} className={cx(styles.companyText)}>
          <i className={cx(styles.chevronIcon, `fa fa-chevron-${isOpen ? 'up' : 'right'}`)}></i>
          <span className={cx(styles.companyName)}>{company.name}</span>
          <span className={cx(styles.companyUserNb)}>({upperFirst(t("global.common.creation"))} : {formatDayDate(new Date(company.createdAt))} - <strong>{company.users.length}</strong> {t("user.user")}{adminNb !== 0 && ( <strong> {t("global.other.ofWhich")} {adminNb} {t("user.role.title.admin_s")}</strong>)})</span>
        </p>
        {!locked && <Switch
          className={styles.readOnlyModeSwitcher}
          checked={!company.readonlyMode}
          size="normal"
          onChange={editionMode =>
            dispatch(
              setReadOnlyModeRequested({
                companyId: company.id,
                readonlyMode: !editionMode,
              })
            )
          }
        >
          {upperFirst(t("global.editionMode"))}
        </Switch>}
        <i onClick={() => dispatch(askLockToggle({
          companyId: company.id
        }))} className={cx(`fa fa-lock${locked ? '-open' : ''}`, "text-danger", styles.lockIcon)}></i>
      </div>
      {foldable(usersRendered)}
    </div>
  );
};

export default CompanyElement;