import DashboardLayout from "@components/admin/dashboad/DashboardLayout";
import { RootState } from "@reducers/index";
import { useDispatch, useSelector, useStore } from "react-redux";
import { CompanyList as CompanyListFromReducer } from "@reducers/admin/companyListReducer"
import { useEffect, useRef, useState } from "react";
import { cancelLockConfirmation, requestLoadMoreUnlockedCompanies, requestLockCompany, findCompaniesByName } from "@actions/admin/company-list/companyListActions";
import Companies from "./common/Companies";
import useBottomReached from "@hooks/utils/useBottomReached";
import cx from "classnames";
import SearchInput from "@components/helpers/form/field/SearchInput";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import SearchCompanyInput from "./common/SearchCompanyInput";
import { upperFirst } from "lodash";
import { t } from "i18next";

const CompanyList = () => {

  const dispatch = useDispatch();
  const itemsContainerRef: any = useRef();

  const {
    companyList: unlockedCompanies,
    isEndReached,
    isLoading,
    companyToToggleId,
    confirmToggleModalOpen,
  } = useSelector<RootState, CompanyListFromReducer>(state => state.admin.companyList.unlocked);

  const refIsEndReached = useRef(isEndReached);
  const refIsLoading = useRef(isLoading);

  const [searchedCompanyName, setSearchedCompanyName] = useState("");

  useEffect(() => {
    refIsEndReached.current = isEndReached
  }, [isEndReached]);
  useEffect(() => {
    refIsLoading.current = isLoading
  }, [isLoading]);
  

  useBottomReached({
    containerRef: itemsContainerRef,
    onBottomReached: () => {
      if (refIsEndReached.current || refIsLoading.current) {
        return;
      }
      dispatch(requestLoadMoreUnlockedCompanies({
        refresh: false
      }));
    }
  })

  useEffect(() => {
    if (searchedCompanyName === "") {
      dispatch(
        requestLoadMoreUnlockedCompanies({
          refresh: true,
        })
      );
    }
  }, [searchedCompanyName]);

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
              dispatch(findCompaniesByName({ name, locked: false }));
            }
          }}
        />
        <Companies companies={unlockedCompanies} locked={false} />
        {isLoading && <i className={cx("fa fa-spinner fa-spin")}></i>}
        {Object.values(unlockedCompanies).length === 0 &&
          searchedCompanyName !== "" && <p>{upperFirst(t("company.search.noResult"))}</p>}
      </div>
      <DangerConfirmModal
        question={`${upperFirst(t("company.block.question"))} ?`}
        btnText={upperFirst(t("global.block"))}
        onConfirm={() =>
          dispatch(
            requestLockCompany({
              companyId: companyToToggleId!,
            })
          )
        }
        small
        onClose={() => dispatch(cancelLockConfirmation())}
        open={confirmToggleModalOpen}
        spinnerOn={false}
      ></DangerConfirmModal>
    </DashboardLayout>
  );
};

export default CompanyList;
