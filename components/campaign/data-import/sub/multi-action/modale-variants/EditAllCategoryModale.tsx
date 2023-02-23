import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";
import selectCartographyForCampaign from "@selectors/cartography/selectCartographyForCampaign";
import { setMappableData } from "@actions/dataImport/entryData/entryDataActions";
import useMultiActionModaleContext from "@components/campaign/data-import/sub/multi-action/hooks/useMultiActionModaleContext";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/editAllcategoryModale.module.scss";

const EditAllCategoryModale = () => {
  const dispatch = useDispatch();
  const { campaignId } = useMultiActionModaleContext();
  const categoriesInCartography = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );
  const cartography = useSelector((state: RootState) =>
    selectCartographyForCampaign(state, campaignId)
  );

  const [categoryId, setCategoryId] = useState<number | null>(null);

  const previewCategory = categoriesInCartography[categoryId ?? -1]?.name;

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editCategory", { count })
        )
      }
      icon={<i className="fas fa-list-alt" />}
      onApplyButtonClick={entryDataIds => {
        if (categoryId != null) {
          dispatch(
            setMappableData({
              entryDataIds,
              dataName: "activityCategory",
              id: categoryId,
              entityName: previewCategory ?? ""
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={categoryId}
          onOptionClick={setCategoryId}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseCategory")
          )}
        >
          {props => (
            <>
              <div className={styles.scopeLabel}>
                {upperFirst(t("footprint.scope.upstream"))}
              </div>
              {Object.values(cartography.UPSTREAM).map(({ id, name }) => (
                <Option
                  {...props}
                  key={id}
                  value={id}
                  className={styles.option}
                >
                  {name}
                </Option>
              ))}
              <div className={styles.scopeLabel}>
                {upperFirst(t("footprint.scope.core"))}
              </div>
              {Object.values(cartography.CORE).map(({ id, name }) => (
                <Option
                  {...props}
                  key={id}
                  value={id}
                  className={styles.option}
                >
                  {name}
                </Option>
              ))}
              <div className={styles.scopeLabel}>
                {upperFirst(t("footprint.scope.downstream"))}
              </div>
              {Object.values(cartography.DOWNSTREAM).map(({ id, name }) => (
                <Option
                  {...props}
                  key={id}
                  value={id}
                  className={styles.option}
                >
                  {name}
                </Option>
              ))}
            </>
          )}
        </SelectOne>
      }
      previewValues={{
        activityCategory: previewCategory,
        activityModel:
          previewCategory != null
            ? upperFirst(t("entry.unaffected"))
            : undefined,
      }}
    />
  );
};

export default EditAllCategoryModale;
