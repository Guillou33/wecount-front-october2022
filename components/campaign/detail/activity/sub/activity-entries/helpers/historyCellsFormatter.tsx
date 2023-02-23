import React from "react";
import { AiOutlineTag } from "react-icons/ai";
import UserBadge from "@components/core/UserBadge";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { ComputeMethodMapping, EmissionFactor } from "@reducers/core/emissionFactorReducer";
import { ActivityEntryReferenceHistory, EntryData } from "@reducers/entries/campaignEntriesReducer";
import { getEmissionFactorText } from "@lib/utils/getEmissionFactorText";
import styles from "@styles/campaign/detail/activity/sub/activity-entries/editEntry.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { loadGetInitialProps } from "next/dist/next-server/lib/utils";

export const renderTooltipContent = (content: string) => {
  return (<Tooltip content={content} hideDelay={0} showDelay={0}>
    <p>{content}</p>
  </Tooltip>);
}

export const renderComputeMethodCell = (computeMethods: ComputeMethodMapping, computeMethodType: ComputeMethodType | undefined, computeMethodId: number | null) => {
  if (!computeMethodId || !computeMethods) {
    let content: string | undefined = undefined;
    
    switch (computeMethodType) {
      // For old custom emission factor entries
      case ComputeMethodType.DEPRECATED_EMISSION_FACTOR:
        content = upperFirst(t("entry.computeMethod.createEmissionFactor"));
        break
      case ComputeMethodType.CUSTOM_EMISSION_FACTOR:
        content = upperFirst(t("entry.computeMethod.customEmissionFactor"));
        break;
      case ComputeMethodType.RAW_DATA:
        content = upperFirst(t("entry.computeMethod.insertRawData"));
        break;
    }
    return content ? renderTooltipContent(content) : '-';
  }

  return renderTooltipContent(computeMethods[computeMethodId]?.name);
}

export const renderEFCell = (emissionFactor: EmissionFactor | null, computeMethodType: ComputeMethodType | undefined, ae: ActivityEntryReferenceHistory | EntryData) => {
  // For old custom emission factor entries
  if (computeMethodType === ComputeMethodType.DEPRECATED_EMISSION_FACTOR) {
    return `${formatNumberWithLanguage(ae.manualTco2)} ${t("footprint.emission.tco2.tco2e")}`;
  }
  if (computeMethodType === ComputeMethodType.CUSTOM_EMISSION_FACTOR) {
    return renderTooltipContent((ae?.customEmissionFactor?.name ? `${ae.customEmissionFactor.name}; ${getEmissionFactorText(
      ae.customEmissionFactor?.value,
      t('footprint.emission.kgco2.kgco2e')
    )}` : '-'));
  }
  return renderTooltipContent((emissionFactor?.name ? `${emissionFactor.name}; ${getEmissionFactorText(
    emissionFactor?.value,
    emissionFactor?.unit
  )}` : '-'));
}

export const renderValue1Cell = (computeMethods: ComputeMethodMapping, computeMethodId: number | null, ae: ActivityEntryReferenceHistory | EntryData, computeMethodType: ComputeMethodType | undefined) => {
  // For old custom emission factor entries
  if (computeMethodType === ComputeMethodType.DEPRECATED_EMISSION_FACTOR) {
    return `${formatNumberWithLanguage(ae.manualUnitNumber)}`;
  }
  if (computeMethodType === ComputeMethodType.CUSTOM_EMISSION_FACTOR) {
    const content = `${formatNumberWithLanguage(ae!.value)}${ae!.customEmissionFactor?.input1Unit ?? ''} (${ae!.customEmissionFactor?.input1Name})`;
    return renderTooltipContent(content);
  }
  if (!computeMethodId || !computeMethods || !ae!.value) {
    return '-';
  }
  const content = `${formatNumberWithLanguage(ae!.value)}${ae!.emissionFactor?.input1Unit ?? ''} (${computeMethods[computeMethodId]?.valueName})`;
  return renderTooltipContent(content);
}

export const renderValue2Cell = (computeMethods: ComputeMethodMapping, computeMethodId: number | null, ae: ActivityEntryReferenceHistory | EntryData) => {
  if (!computeMethods || !computeMethodId || !ae.value2) {
    return '-';
  }
  const content = `${formatNumberWithLanguage(ae.value2)}${ae.emissionFactor?.input1Unit ?? ''} (${computeMethods[computeMethodId]?.value2Name})`;
  return renderTooltipContent(content);
}

export const renderWriterCell = (ae: ActivityEntryReferenceHistory | EntryData) => {
  return !ae.writerId ? '-' : (
    <UserBadge
      userId={ae.writerId}
      small
      defaultTooltip
    />
  )
}

export const renderOwnerCell = (ae: ActivityEntryReferenceHistory | EntryData) => {
  return !ae.ownerId ? '-' : (
    <UserBadge
      userId={ae.ownerId}
      small
      defaultTooltip
    />
  )
}

export const renderTagCell = (tagName: string | undefined, tagId: number) => {
  if(tagName == null){
    return;
  }
  return (
    <span className={styles.tag} key={tagId}>
      <AiOutlineTag className={styles.tagIcon}/>
      {tagName}
    </span>
  );
}
