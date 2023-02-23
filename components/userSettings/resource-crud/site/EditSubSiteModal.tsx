import { requestUpdateDescription, requestUpdateName, requestUpdateParent, setSearchedSitesInSubSiteModalInSettings } from "@actions/core/site/siteActions";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { Site, SiteList, SubSite } from "@reducers/core/siteReducer";
import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useDispatch } from "react-redux";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { t } from "i18next";
import _,{ upperFirst } from "lodash";
import React from "react";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import Checkbox from "@components/helpers/ui/CheckboxInput";
import useAllSiteList from "@hooks/core/useAllSiteList";
import SearchInput from "@components/helpers/form/field/SearchInput";
import useSearchedSitesInSubSiteModalInSettings from "@hooks/core/useSearchedSitesInSubSiteModalInSettings";

interface Props {
  parentSite: Site;
  editingSite: SubSite | undefined;
  onClose: () => void;
  isArchived: boolean;
}

const EditSubSiteModal = ({
  // sites,
  parentSite,
  editingSite,
  onClose,
  isArchived
}: Props) => {
  const dispatch = useDispatch();

  const sites = useSearchedSitesInSubSiteModalInSettings(isArchived ? true : false);

  const [isInSite, setIsInSite] = React.useState(true);

  const [parentSiteId, setParentSiteId] = React.useState<number | null>(parentSite === undefined ? null : parentSite.id);

  const [searchTerm, setSearchTerm] = React.useState("");

  return (
    <ClassicModal
      open={!!editingSite}
      onClose={onClose}
      small
    >
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={!editingSite ? "" : editingSite.name}
          placeholder={upperFirst(t("global.common.name"))}
          onHtmlChange={(value: string) => {
            if(editingSite !== undefined){
              dispatch(
                requestUpdateName({
                  siteId: editingSite!.id,
                  parentSiteId: parentSite?.id,
                  newName: value,
                })
              );
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.description"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          className={cx("field")}
          value={!editingSite ? "" : editingSite.description}
          placeholder={upperFirst(t("global.common.description"))}
          onHtmlChange={(value: string) => {
            if(editingSite !== undefined){
              dispatch(
                requestUpdateDescription({
                  siteId: editingSite!.id,
                  parentSiteId: parentSite?.id,
                  newDescription: value,
                })
              );
          }
          }}
        />
      </div>
      {(parentSiteId !== 0) && (
        <div>
          {/* <Checkbox
            className={cx(styles.chkCreateSite)}
            checked={isInSite}
            onChange={() => {
                dispatch(
                    requestUpdateParent({
                        siteId: editingSite!.id,
                        newParentSiteId: null,
                        oldParentSiteId: parentSiteId
                    })
                );
                setParentSiteId(Object.values(sites)[0].id);
                setIsInSite(!isInSite)
            }}
            id="is-in-site"
          >
            Est-il dans un site existant ?
          </Checkbox> */}
          <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.localization"))} : </p>
          <SelectOne
            disabled={!isInSite}
            className={cx([styles.parentSiteSelector])}
            selected={parentSiteId}
            onOptionClick={(siteId) => {
              dispatch(
                requestUpdateParent({
                  siteId: editingSite!.id,
                  oldParentSiteId: parentSiteId,
                  newParentSiteId: siteId
                })
              );
              setParentSiteId(siteId)
            }}
          >
            {(ctx) => (
              <>
                <SearchInput
                    className={cx(styles.parentSiteSearch)}
                    placeholder={`${upperFirst(t("site.search"))}...`}
                    value={searchTerm}
                    onChange={e => {
                        const name = e.target.value;
                        setSearchTerm(name);
                        if (name !== "") {
                            dispatch(setSearchedSitesInSubSiteModalInSettings({searchedTerms: name}));
                        }
                        if(name === ""){
                            dispatch(setSearchedSitesInSubSiteModalInSettings({searchedTerms: ""}));
                        }
                    }}
                />
                {sites.map(
                  (option) => (
                    <Option
                      {...ctx}
                      value={option.id}
                      key={option.id}
                    >
                      {option.name}
                    </Option>
                  )
                )}
              </>
            )}
          </SelectOne>
        </div>
      )}
    </ClassicModal>
  );
};

export default EditSubSiteModal;
