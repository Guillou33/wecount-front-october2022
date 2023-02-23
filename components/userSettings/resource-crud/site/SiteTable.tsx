import useFoldable from "@hooks/utils/useFoldable";
import { RootState } from "@reducers/index";
import { ShownSubSites, Site, SiteList, SubSite } from "@reducers/core/siteReducer";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import {
  requestArchive,
  requestUnarchive,
  setShownSubSitesInSettings,
} from "@actions/core/site/siteActions";
import React, { useState } from "react";
import EditSiteModal from "@components/userSettings/resource-crud/site/EditSiteModal";
import CreateSiteModal from "@components/userSettings/resource-crud/site/CreateSiteModal";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import styles from "@styles/userSettings/siteListLayout.module.scss";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import _, { upperFirst } from "lodash";
import { t } from "i18next";
import { useSort } from "@hooks/utils/useSort";
import SubSiteRow from "./SubSiteRow";
import SiteRow from "./SiteRow";
import { SortFields, sortMethods } from "@components/userSettings/helpers/sort";
import { FilterNames } from "@reducers/filters/filtersReducer";
import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";
import IfHasPerimeterRole from "@components/auth/access-control/IfHasPerimeterRole";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import Link from "next/link";
import { setSiteSelection } from "@actions/core/selection/coreSelectionActions";

interface Props {
    sites: Site[];
    onMultipleArchiveRequested: () => void;
}

const SiteTable = ({
  sites,
  onMultipleArchiveRequested
}: Props) => {
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const [editingSiteId, setEditingSiteId] = useState<number | undefined>(
    undefined
  );
  const [creationModalOpen, setCreationModalOpen] = useState<boolean>(false);

  const {
    isOpen: isOpenArchive,
    toggle: toggleArchive,
    foldable: foldableArchive,
  } = useFoldable(false);

  const dispatch = useDispatch();

  const siteList = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  );

  // used for check
  const sitesSelected = useSelector<RootState, Record<number, boolean>>(
    state => state.coreSelection.site
  );

  const activeSiteNumber = Object.values(siteList).filter(site => !site.archivedDate).length;

  const showSubSites = useSelector<RootState, ShownSubSites>(
      state => state.core.site.shownSubSitesInSettings
  )

  // used for toggling cartography filters when site is archived
  const selectedSitesInCartographyFilters = useSelector(
    (state: RootState) => state.filters[FilterNames.CARTOGRAPHY_SITES].elementIds
  );

  const subSitesList = Object.values(siteList).map(site => {
    if(site.subSites === undefined){
      return [];
    }
    return Object.values(site.subSites)
  }).flat();

  const subSiteIds = subSitesList.map(subSite => subSite.id);

  const mainSites = sites.filter(site => !subSitesList.map(subSite => subSite.id).includes(site.id));

  const { sortField, sortDirAsc, updateSort, sortValues } = useSort<SortFields, Site>(SortFields.NAME, sortMethods);

  const renderArchivedSites = (active: boolean, archivedSites: Site[]) => {
    sortValues(archivedSites);
    const allocatedSites = () => archivedSites.filter(site => site.archivedDate !== null).map((site) => {
        return (site.archivedDate !== null) ? (
            <>
                <SiteRow 
                    key={site.id} 
                    site={site}
                    areSubSitesShown={false}
                    hasSubSites={
                        site.subSites !== undefined && 
                        Object.values(site.subSites).length > 0
                    }
                    showSubSites={() => dispatch(setShownSubSitesInSettings({siteId: site.id, show: !showSubSites[site.id]}))}
                    isSubSiteForArchive={subSiteIds.includes(site.id)}
                    onSiteClick={withReadOnlyAccessControl(() => {
                      setEditingSiteId(site.id);
                    })}
                    isArchived={site.archivedDate !== null}
                    onArchiveClick={withReadOnlyAccessControl(() => {
                      dispatch(requestArchive(site.id));
                      
                    })}
                    onUnarchiveClick={withReadOnlyAccessControl(() => {
                      dispatch(requestUnarchive(site.id));
                    })}
                />
            </>
        ) : (
          <></>
        )
    });
    return (
        <tbody>
            {allocatedSites()}
        </tbody>
    )
  }

  const renderSites = (active: boolean, allSitesResults: Site[]) => {
    if(!active) return renderArchivedSites(false, Object.values(siteList).filter(site => site.archivedDate !== null));

    sortValues(allSitesResults);
    const allocatedSites = () => allSitesResults.filter(site => site.archivedDate === null).map((site) => {
        const subSites = Object.values(site.subSites ?? {});
        const renderSubSites = () => site.subSites === undefined && subSites.length === 0 ? <></> : subSites.filter(subSite => subSite.archivedDate === null)
          .map(subSite => {
            return (subSite.archivedDate === null) ? (
              <>
                <SubSiteRow
                  key={subSite.id}
                  subSite={subSite}
                  parentSite={site}
                  subSitesList={subSitesList.filter(subSite => !subSite.archivedDate)}
                  onSelectSite={() => dispatch(setSiteSelection({siteId: subSite.id, check: !sitesSelected[subSite.id]}))}
                  isSelected={sitesSelected[subSite.id]}
                  isArchived={!!subSite.archivedDate}
                  onArchiveClick={withReadOnlyAccessControl(() => {
                    dispatch(requestArchive(subSite.id, site.id));
                    if(Object.keys(selectedSitesInCartographyFilters).includes(subSite.id.toString())){
                      dispatch(
                        toggleSearchableFilterPresence({
                          filterName: FilterNames.CARTOGRAPHY_SITES,
                          elementId: subSite.id,
                        })
                      )
                    }
                  })}
                /> 
              </>
            ) : (
              <></>
            )
        });
        return (site.archivedDate === null) ? (
            <>
                <SiteRow 
                    key={site.id} 
                    site={site}
                    areSubSitesShown={ 
                        showSubSites[site.id]
                    }
                    hasSubSites={
                        site.subSites !== undefined && 
                        Object.values(site.subSites).filter(subSite => (subSite.archivedDate === null)).length > 0
                    }
                    showSubSites={() => dispatch(setShownSubSitesInSettings({siteId: site.id, show: !showSubSites[site.id]}))}
                    isSubSiteForArchive={false}
                    onSelectSite={() => dispatch(setSiteSelection({siteId: site.id, check: !sitesSelected[site.id]}))}
                    isSelected={sitesSelected[site.id]}
                    onSiteClick={withReadOnlyAccessControl(() => {
                      setEditingSiteId(site.id);
                    })}
                    isArchived={!!site.archivedDate}
                    onArchiveClick={withReadOnlyAccessControl(() => {
                      dispatch(requestArchive(site.id));
                    })}
                    onUnarchiveClick={withReadOnlyAccessControl(() => {
                      dispatch(requestUnarchive(site.id));
                    })}
                />
                {showSubSites[site.id] && renderSubSites()}
            </>
        ) : (
          <></>
        )
    });
    return (
        <tbody>
            {allocatedSites()}
        </tbody>
    )
  }

  const renderTableSites = (active: boolean) => {
      return (
        <>
            <table className={cx("wecount-table", styles.allSites)}>
                <thead>
                    <th style={{width: 60}}></th>
                    {renderHeaderField(upperFirst(t("global.common.name")), SortFields.NAME, "nameTh")}
                    {renderHeaderField(upperFirst(t("global.common.description")), SortFields.DESCRIPTION)}
                    <th style={{width: 100}}>{upperFirst(t("global.common.actions"))}</th>
                </thead>
                {mainSites.length > 0 && renderSites(active, mainSites)}
            </table>
            {sites.length === 0 && (
                <div style={{textAlign:"center", fontStyle: "italic", width: "100%", marginTop: 20}}>
                    {upperFirst(t("site.noConfiguredSite"))}
                </div>
            )}
        </>
      );
  };

  const renderHeaderField = (
      name: string,
      sortFieldAssociated: SortFields,
      className?: string
  ) => {
      return (
          <th
              className={cx("header-clickable", styles[className ?? ""], {
                  ["active"]: sortField === sortFieldAssociated,
              })}
              onClick={() => updateSort(sortFieldAssociated)}
          >
              {name}
          </th>
      );
  };

  const renderArchivedList = () => {
    return (
      <div className={cx(styles.archivedListContainer)}>
        <h1 className={cx(styles.archivedListContainerTitle)}>
          {upperFirst(t("site.archive.archivedSites"))}
        </h1>
        {renderTableSites(false)}
      </div>
    );
  }

  return (
      <>
        <div className={cx(styles.main)}>
          <div className={cx(styles.addSites)}>
            {!_.isEmpty(_.filter(sitesSelected, id => id === true)) && (
              <button style={{marginRight: 10}} className={cx("button-1")} onClick={onMultipleArchiveRequested}>
                <i style={{marginRight: 10}} className={cx("fa fa-archive")}></i>
                {upperFirst(t("site.archive.archiveSites"))}
              </button>
            )}
            <IfHasPerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
                <Link
                  href={`/userSettings/data-import/sites`}
                >
                    <a className={cx("button-1", styles.importLink)}>
                        <i className="fas fa-upload"></i>
                    </a>
                </Link>
              </IfHasPerimeterRole>
            <ButtonSpinner
              spinnerOn={false}
              onClick={withReadOnlyAccessControl(() => setCreationModalOpen(true))}
              className={cx("button-1")}
            >
              + {upperFirst(t("global.add"))}
            </ButtonSpinner>
          </div>
          <div className={cx(styles.seeArchivesLinkContainer)}>
            <a className={cx(styles.seeArchivesLink)} onClick={toggleArchive}>
              <i className={cx(isOpenArchive ? "fa fa-eye-slash" : "fa fa-archive")}></i> {isOpenArchive ? upperFirst(t("site.archive.hide")) : upperFirst(t("site.archive.see"))}
            </a>
          </div>
          {
            isOpenArchive ?
              foldableArchive(renderArchivedList()) :
                activeSiteNumber ? renderTableSites(true) : (
                  <p className={cx(styles.noItemText)}>{upperFirst(t("site.noConfiguredSite"))}.</p>
                )
          }
          {/* {foldableArchive(renderArchivedList())} */}
        </div>
        <EditSiteModal
          editingSite={!editingSiteId ? undefined : siteList[editingSiteId]}
          onClose={() => {
            setEditingSiteId(undefined);
          }}
        />
        <CreateSiteModal
          open={creationModalOpen}
          onClose={() => {
            setCreationModalOpen(false);
            setEditingSiteId(undefined);
          }}
        />
      </>
  );
};

export default SiteTable;
