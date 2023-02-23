import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";

import { setMappableData } from "@actions/dataImport/entryData/entryDataActions";
import useAllSiteList from "@hooks/core/useAllSiteList";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import {
  DefaultContainer,
  SearchContainer,
} from "@components/helpers/ui/selects/selectionContainers";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";
import Highlight from "@components/helpers/Highlight";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/editAllSitesModale.module.scss";

const EditAllSiteModale = () => {
  const dispatch = useDispatch();
  const siteList = useAllSiteList({ includeSubSites: true });
  const allSites = Object.values(siteList);

  const isLongList = allSites.length > 10;

  const [siteId, setSiteId] = useState<number | null>(null);
  const [searchedSite, setSearchedSite] = useState("");
  const isFiltered = isLongList && searchedSite !== "";

  const previewSite = siteList[siteId ?? -2]?.name;

  const sitesToRender = isFiltered
    ? allSites.filter(site =>
        site.name.toLowerCase().includes(searchedSite.toLowerCase())
      )
    : allSites;

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editSite", { count })
        )
      }
      icon={
        <img
          src={`/icons/modale/icon-map-pin.svg`}
          alt=""
          style={{ transform: "translateY(-3px)" }}
        />
      }
      onApplyButtonClick={entryDataIds => {
        if (siteId != null) {
          dispatch(
            setMappableData({
              entryDataIds,
              dataName: "site",
              id: siteId,
              entityName: previewSite ?? "",
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={siteId}
          onOptionClick={setSiteId}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseSite")
          )}
          className={styles.siteSelector}
          renderSelectionContainer={ctx =>
            isLongList ? (
              <SearchContainer
                {...ctx}
                searchedValue={searchedSite}
                setSearchedValue={setSearchedSite}
                className={styles.searchInput}
              >
                {siteList[siteId ?? -2]?.name}
              </SearchContainer>
            ) : (
              <DefaultContainer {...ctx}>
                {siteList[siteId ?? -2]?.name}
              </DefaultContainer>
            )
          }
        >
          {props => (
            <>
              {sitesToRender.map(({ id, name }) => (
                <Option
                  {...props}
                  key={id}
                  value={id}
                  isSelected={siteId === id}
                >
                  {isFiltered ? (
                    <Highlight search={searchedSite}>{name}</Highlight>
                  ) : (
                    name
                  )}
                </Option>
              ))}
              {sitesToRender.length === 0 && (
                <div className="font-italic font-weight-light ml-2">
                  {upperFirst(t("global.noResult"))}
                </div>
              )}
            </>
          )}
        </SelectOne>
      }
      previewValues={{
        site: previewSite,
      }}
    />
  );
};

export default EditAllSiteModale;
