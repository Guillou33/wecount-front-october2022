import DashboardLayout from "@components/admin/dashboad/DashboardLayout";
import { RootState } from "@reducers/index";
import { useDispatch, useSelector } from "react-redux";
import { CompanyList as CompanyListFromReducer } from "@reducers/admin/companyListReducer";
import { useEffect, useRef, useState } from "react";
import {
  cancelUnlockConfirmation,
  requestLoadMoreLockedCompanies,
  requestUnlockCompany,
  findCompaniesByName,
} from "@actions/admin/company-list/companyListActions";
import Companies from "./common/Companies";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import useBottomReached from "@hooks/utils/useBottomReached";
import SearchInput from "@components/helpers/form/field/SearchInput";
import cx from "classnames";
import { upperFirst } from "lodash";
import { t } from "i18next";

const LockedCompanyList = () => {
  const dispatch = useDispatch();
  const itemsContainerRef: any = useRef();

  const {
    companyList: lockedCompanies,
    isEndReached,
    isLoading,
    companyToToggleId,
    confirmToggleModalOpen,
  } = useSelector<RootState, CompanyListFromReducer>(
    state => state.admin.companyList.locked
  );

  const refIsEndReached = useRef(isEndReached);
  const refIsLoading = useRef(isLoading);

  const [searchedCompanyName, setSearchedCompanyName] = useState("");

  useEffect(() => {
    refIsEndReached.current = isEndReached;
  }, [isEndReached]);
  useEffect(() => {
    refIsLoading.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    if (searchedCompanyName === "") {
      dispatch(
        requestLoadMoreLockedCompanies({
          refresh: true,
        })
      );
    }
  }, [searchedCompanyName]);

  useBottomReached({
    containerRef: itemsContainerRef,
    onBottomReached: () => {
      if (refIsEndReached.current || refIsLoading.current) {
        return;
      }
      dispatch(
        requestLoadMoreLockedCompanies({
          refresh: false,
        })
      );
    },
  });

  return (
    <DashboardLayout>
      <div ref={itemsContainerRef} className="page-content">
        <SearchInput
          placeholder="Rechercher une entreprise..."
          value={searchedCompanyName}
          onChange={e => {
            const name = e.target.value;
            setSearchedCompanyName(name);
            if (name !== "") {
              dispatch(findCompaniesByName({ name, locked: true }));
            }
          }}
        />
        <Companies companies={lockedCompanies} locked={true} />
        {isLoading && <i className={cx("fa fa-spinner fa-spin")}></i>}
        {Object.values(lockedCompanies).length === 0 &&
          searchedCompanyName !== "" && <p>{upperFirst(t("company.search.noResult"))}</p>}
      </div>
      <DangerConfirmModal
        question={`${upperFirst(t("company.block.question"))} ?`}
        btnText={upperFirst(t("global.block"))}
        onConfirm={() => dispatch(requestUnlockCompany({
          companyId: companyToToggleId!
        }))}
        small
        onClose={() => dispatch(cancelUnlockConfirmation())}
        open={confirmToggleModalOpen}
        spinnerOn={false}
      ></DangerConfirmModal>
    </DashboardLayout>
  );
};

export default LockedCompanyList;
