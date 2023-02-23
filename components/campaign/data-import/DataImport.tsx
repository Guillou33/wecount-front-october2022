import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/router";
import { t } from "i18next";
import { upperFirst } from "lodash";

import { RootState } from "@reducers/index";
import { ModaleVariant } from "@components/campaign/data-import/sub/multi-action/MultiActionModale";

import useSetOnceAuthUtils from "@hooks/core/useSetOnceAuthUtils";
import useSetOnceCampaignUtils from "@hooks/core/useSetOnceCampaignUtils";
import useSetOnceAllPerimeters from "@hooks/core/reduxSetOnce/useSetOnceAllPerimeters";
import useDataMapper from "@hooks/data-import/useDataMapper";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import useSetOnceProducts from "@hooks/core/reduxSetOnce/useSetOnceProducts";
import useSetOnceEntryTags from "@hooks/core/reduxSetOnce/useSetOnceEntryTags";
import selectAllEntryData from "@selectors/dataImport/selectAllEntryData";
import { cartographyAssociationIgnoredColumns } from "@lib/core/dataImport/columnConfig";

import {
  setParsing,
  setEntryDataList,
  saveDataRequested,
  reset as resetEntryData,
} from "@actions/dataImport/entryData/entryDataActions";
import { reset as resetTableSettings } from "@actions/dataImport/tableSettings/tableSettingsAction";

import {
  entryDataKeys,
  hashMapRowToRawEntryData,
} from "@lib/core/dataImport/rawDataToEntryData";

import Header from "@components/campaign/data-import/sub/Header";
import Stepper from "@components/helpers/ui/Stepper";
import StepLoadData from "@components/campaign/data-import/sub/steps/StepLoadData";
import StepCompletion from "@components/campaign/data-import/sub/steps/StepCompletion";
import StepCartographyAssociation from "@components/campaign/data-import/sub/steps/StepCartographyAssociation";
import ExitModalConfirm from "@components/campaign/data-import/sub/ExitModalConfirm";
import DataImportSaveStatus from "./sub/DataImportSaveStatus";
import ColumnSettingsModale from "./sub/ColumnSettingsModale";
import RightModal from "@components/helpers/modal/RightModal";
import Spinner from "@components/helpers/ui/Spinner";
import MultiActionModale from "@components/campaign/data-import/sub/multi-action/MultiActionModale";

import createExcelParser from "@lib/utils/excel-parser/createExcelParser";
import getSavableDatalist from "@lib/core/dataImport/getSavableDataList";

import styles from "@styles/campaign/data-import/dataImport.module.scss";

interface Props {}

const DataImport = ({}: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();

  useSetOnceAuthUtils();
  useSetOnceCampaignUtils();
  useSetOnceAllPerimeters();

  useSetOnceSites();
  useSetOnceProducts();
  useSetOnceUsers();
  useSetOnceEntryTags();

  const currentCampaignId = useSelector(
    (state: RootState) => state.campaign.currentCampaign
  );
  const dataMapper = useDataMapper(currentCampaignId!);

  const campaignInformations = useSelector((state: RootState) =>
    currentCampaignId != null
      ? state.campaign.campaigns[currentCampaignId]?.information ?? null
      : null
  );
  const entryDataList = useSelector(selectAllEntryData);
  const { error, isSaved, isSaving } = useSelector(
    (state: RootState) => state.dataImport.entryData.requestStatus
  );

  const showSteps = error == null && !isSaved && !isSaving;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);

  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showColumnSettings, setShowColumnSettings] = useState(false);

  const [showMultiActionModale, setShowMultiActionModale] =
    useState<ModaleVariant | null>(null);

  return campaignInformations != null ? (
    <>
      <div className={styles.dataImport}>
        <Header campaignInformations={campaignInformations}></Header>
        <main className={styles.content}>
          {showSteps ? (
            <>
              <Stepper
                currentStep={step}
                availableSteps={[
                  {
                    label: upperFirst(t("dataImport.steps.load.name")),
                    stepNumber: 1,
                  },
                  {
                    label: upperFirst(t("dataImport.steps.tidyUp.name")),
                    stepNumber: 2,
                  },
                  {
                    label: upperFirst(t("dataImport.steps.fillIn.name")),
                    stepNumber: 3,
                  },
                ]}
              />
              {step === 1 && (
                <StepLoadData
                  file={file}
                  onFileChange={setFile}
                  onNextStepClick={async () => {
                    setStep(2);
                    if (file != null) {
                      try {
                        dispatch(setParsing({ isParsing: true }));
                        const parser = createExcelParser();
                        await parser.load(file);
                        const parsed = parser.parseAsHashMap({
                          sheet: 0,
                          ignoreFirstRow: true,
                          mapping: entryDataKeys,
                        });
                        const entryDataList = parsed.map(row =>
                          dataMapper(hashMapRowToRawEntryData(row))
                        );
                        dispatch(setEntryDataList({ entryDataList }));
                      } catch (err) {
                        console.log(err);
                      }
                    }
                  }}
                  onCancelClick={() => setShowExitConfirm(true)}
                />
              )}
              {step === 2 && (
                <StepCartographyAssociation
                  campaignId={currentCampaignId!}
                  onPreviousStepClick={() => setStep(1)}
                  onCancelClick={() =>
                    setTimeout(() => setShowExitConfirm(true))
                  }
                  onNextStepClick={() => setStep(3)}
                  onColumnSettingsClick={() => setShowColumnSettings(true)}
                  onMultiActionClick={variant =>
                    setTimeout(() => setShowMultiActionModale(variant))
                  }
                />
              )}
              {step === 3 && (
                <StepCompletion
                  onCancelClick={() =>
                    setTimeout(() => setShowExitConfirm(true))
                  }
                  onPreviousStepClick={() => setStep(2)}
                  onNextStepClick={() => {
                    const savableData = getSavableDatalist(entryDataList, {
                      fileName: file?.name ?? "",
                      importTimestamp: Date.now(),
                    });
                    dispatch(
                      saveDataRequested({
                        campaignId: campaignInformations.id,
                        data: savableData,
                      })
                    );
                  }}
                  onColumnSettingsClick={() => setShowColumnSettings(true)}
                  onMultiActionClick={variant =>
                    setTimeout(() => setShowMultiActionModale(variant))
                  }
                />
              )}
            </>
          ) : (
            <DataImportSaveStatus campaignId={campaignInformations.id} />
          )}
        </main>
      </div>
      <ExitModalConfirm
        onClose={() => setShowExitConfirm(false)}
        open={showExitConfirm}
        onConfirm={() => {
          router.push(`/campaigns/${campaignInformations.id}`);
          dispatch(resetEntryData());
          dispatch(resetTableSettings());
        }}
      />
      <RightModal
        open={showColumnSettings}
        onClose={() => setShowColumnSettings(false)}
      >
        <ColumnSettingsModale
          onClose={() => setShowColumnSettings(false)}
          ignoredColumns={
            step === 2 ? cartographyAssociationIgnoredColumns : []
          }
        />
      </RightModal>
      <MultiActionModale
        variant={showMultiActionModale}
        onClose={() => setShowMultiActionModale(null)}
        step={step}
        campaignId={currentCampaignId!}
      />
    </>
  ) : (
    <div className={styles.spinnerContainer}>
      <Spinner>{upperFirst(t("dataImport.common.pageLoading"))}</Spinner>
    </div>
  );
};

export default DataImport;
