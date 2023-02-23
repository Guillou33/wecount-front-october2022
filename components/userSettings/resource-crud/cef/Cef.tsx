import { RootState } from "@reducers/index";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import SiteProductLayout from "@components/userSettings/resource-crud/common/SiteProductLayout";
import {
  requestArchive,
  requestUnarchive,
} from "@actions/core/customEmissionFactor/customEmissionFactorActions";
import { useEffect, useState } from "react";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { CustomEmissionFactor, CustomEmissionFactorList } from "@reducers/core/customEmissionFactorReducer";
import CefLine from "./CefLine";
import useSetCustomEmissionFactors from "@hooks/core/reduxSetOnce/useSetCustomEmissionFactors";
import CreateCefModal from "./CreateCefModal";
import EditCefModal from "./EditCefModal";
import styles from "@styles/userSettings/resource-crud/cef/cef.module.scss";

const Cef = () => {
  const dispatch = useDispatch();
  useSetCustomEmissionFactors();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const [archivedFilterOn, setArchivedFilterOn] = useState(false);
  const [editingCefId, setEditingCefId] = useState<number | undefined>(
    undefined
  );
  const [creationModalOpen, setCreationModalOpen] = useState<boolean>(false);

  const cefList = useSelector<RootState, CustomEmissionFactorList>(state => state.core.customEmissionFactor.customEmissionFactors)

  const renderCefs = (active: boolean) => {
    return Object.values(cefList).filter(cef => active === !cef.archivedDate).map((cef) => {
      return (
        <CefLine
          key={cef.id}
          title={cef.name}
          source={cef.source}
          comment={cef.comment}
          value={cef.value}
          input1Name={cef.input1Name}
          input1Unit={cef.input1Unit}
          isArchived={!!cef.archivedDate}
          onArchiveClick={withReadOnlyAccessControl(() => {
            dispatch(requestArchive(cef.id));
          })}
          onUnarchiveClick={withReadOnlyAccessControl(() => {
            dispatch(requestUnarchive(cef.id));
          })}
          onEditClick={withReadOnlyAccessControl(() => {
            setEditingCefId(cef.id);
          })}
        />
      );
    });
  };

  return (
    <SiteProductLayout>
      <div className={cx(styles.main)}>
        <ButtonSpinner
          spinnerOn={false}
          onClick={withReadOnlyAccessControl(() => setCreationModalOpen(true))}
          className={cx("button-1 float-right mb-4")}
        >
          + {upperFirst(t("global.add"))}
        </ButtonSpinner>
        <div className="clearfix"></div>
        <div className={cx(styles.linkSeeArchivedContainer)}>
          <a className={cx(styles.linkSeeArchived)} onClick={() => setArchivedFilterOn(!archivedFilterOn)}><i className={cx(archivedFilterOn ? "fa fa-arrow-left" : "fa fa-eye")}></i> {archivedFilterOn ? upperFirst(t("cef.archive.hide")) : upperFirst(t("cef.archive.see"))}</a>
        </div>
        <div className={cx()}>
          <table className={cx("wecount-table")}>
            <thead>
              <tr>
                <th>
                  {upperFirst(t("cef.fields.name"))}
                </th>
                <th>
                  {upperFirst(t("cef.fields.value"))}
                </th>
                <th>
                  {upperFirst(t("cef.fields.input1Name"))}
                </th>
                <th>
                  {upperFirst(t("cef.fields.input1Unit"))}
                </th>
                <th>
                  {upperFirst(t("cef.fields.source"))}
                </th>
                <th>
                  {upperFirst(t("cef.fields.comment"))}
                </th>
                <th>
                  {upperFirst(t("global.common.actions"))}
                </th>
              </tr>
            </thead>
            <tbody>
              {renderCefs(!archivedFilterOn)}
            </tbody>
          </table>
        </div>
      </div>
      <EditCefModal
        editingCef={!editingCefId ? undefined : cefList[editingCefId]}
        onClose={() => setEditingCefId(undefined)}
      />
      <CreateCefModal
        open={creationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </SiteProductLayout>
  );
};

export default Cef;
