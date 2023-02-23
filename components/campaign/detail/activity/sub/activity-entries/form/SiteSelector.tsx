import { useSelector } from "react-redux";
import { useState } from "react";
import { t } from "i18next";
import upperFirst from "lodash/upperFirst";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { Site, SiteList, SubSiteList } from "@reducers/core/siteReducer";

import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import {
  DefaultContainer,
  SearchContainer,
} from "@components/helpers/ui/selects/selectionContainers";
import Highlight from "@components/helpers/Highlight";

import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";

interface Props {
  selectedSiteId: number | null;
  onChange: (siteId: number | null) => void;
  selectorClassName?: string;
  className?: string;
  disabled?: boolean;
  canBeModified?: boolean;
  onClickParent?: () => void;
}

const SiteSelector = ({
  selectedSiteId,
  onChange,
  selectorClassName,
  className,
  disabled = false,
  canBeModified = true,
  onClickParent,
}: Props) => {
  useSetOnceSites();

  const sites = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  );

  const sitesWithDefault = [
    ...Object.values(sites).filter(site => site.archivedDate === null),
    {
      id: -1,
      name: t("entry.unaffected"),
      subSites: {} as SubSiteList
    },
  ];

  // display archived sites as "non affectés"
  const siteId =
    sites[selectedSiteId ?? -1]?.archivedDate === null ? selectedSiteId : -1;

  const site = sites[selectedSiteId ?? -1] ?? undefined;

  const isLongList = sitesWithDefault.length > 10;

  const [searchedSite, setSearchedSite] = useState("");

  const isSiteListFiltered = isLongList && searchedSite !== "";

  const sitesToRender = isSiteListFiltered
    ? sitesWithDefault.filter(site =>
        site.name.toLowerCase().includes(searchedSite.toLowerCase())
      )
    : sitesWithDefault;

  
  const subSitesList = Object.values(sites).map(site => {
    if(site.subSites === undefined){
      return [];
    }
    return Object.values(site.subSites)
  }).flat();

  const renderSelectionContent = () => {
    return (
      <div className={styles.selection}>
        <img
          className={styles.picto}
          src={`/icons/modale/icon-map-pin.svg`}
          alt=""
        />
        <div className={styles.name}>{site?.name ?? t("entry.unaffected")}</div>
      </div>
    );
  };

  if (!canBeModified) {
    return (
      <div
        className={cx(styles.siteProductTextContainer, className)}
        onClick={onClickParent}
      >
        <img
          className={styles.picto}
          src={`/icons/modale/icon-map-pin.svg`}
          alt=""
        />
        <span className={styles.name}>
          {site?.name ?? t("entry.unaffected")}
        </span>
      </div>
    );
  }

  return (
    <SelectOne
      selected={siteId}
      onOptionClick={siteId => onChange(siteId !== -1 ? siteId : null)}
      alignment="center"
      className={selectorClassName}
      renderSelectionContainer={({ children, ...ctx }) =>
        isLongList ? (
          <SearchContainer
            {...ctx}
            searchedValue={searchedSite}
            setSearchedValue={setSearchedSite}
            searchInputClassName={styles.searchContainerInput}
          >
            {renderSelectionContent()}
          </SearchContainer>
        ) : (
          <DefaultContainer {...ctx}>
            {renderSelectionContent()}
          </DefaultContainer>
        )
      }
      disabled={disabled}
    >
      {ctx => (
        <>
          {sitesToRender.filter(site => !subSitesList.map(subSite => subSite.id).includes(site.id)).map(site => {

            const renderSubSites = (site: Site | {
              id: number;
              name: string;
              subSites: SubSiteList;
          }) => {
              return Object.values(site.subSites ?? {}).filter(subSite => subSite.archivedDate === null).map(subSite => {
                return <Option
                    {...ctx}
                    value={subSite.id}
                    key={subSite.id}
                    isSelected={subSite.id === siteId}
                  >
                    <div style={{marginLeft: 15}}>
                      {isSiteListFiltered ? (
                        <Highlight search={searchedSite} className={styles.highlight}>
                          {subSite.name}
                        </Highlight>
                      ) : (
                        subSite.name
                      )}
                    </div>
                  </Option>
              })
            }

            return (
                <>
                  <Option
                    {...ctx}
                    value={site.id}
                    key={site.id}
                    isSelected={site.id === siteId}
                  >
                    {isSiteListFiltered ? (
                      <Highlight search={searchedSite} className={styles.highlight}>
                        {site.name}
                      </Highlight>
                    ) : (
                      site.name
                    )}
                  </Option>
                  {Object.values(site.subSites ?? {}).length > 0 && renderSubSites(site)}
                </>
              )
            }
          )}
          {sitesToRender.length === 0 && (
            <div className="font-italic font-weight-light ml-2">
              {upperFirst(t("global.noResult"))}
            </div>
          )}
        </>
      )}
    </SelectOne>
  );
};

export default SiteSelector;
