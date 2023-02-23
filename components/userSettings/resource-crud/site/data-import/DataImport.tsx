import { t } from "i18next";
import _, { upperFirst } from "lodash";
import React from "react";
import ImportLayout from "../../common/ImportLayout";
import Stepper from "@components/helpers/ui/Stepper";
import { useRouter } from "next/router";
import StepLoadData from "./StepLoadData";
import StepFillData from "./StepFillData";
import StepCompletion from "./StepCompletion";
import createExcelParser from "@lib/utils/excel-parser/createExcelParser";
import { useDispatch, useSelector } from "react-redux";
import { dataSaved, resetSaveState, resetSitesData, saveSiteDataInApi, setParsing, setSitesDataList } from "@actions/dataImport/sitesData/sitesDataActions";
import { dataMapper, hashMapRowToRawSiteData, siteDataKeys } from "@lib/core/dataImport/rawDataToSiteData";
import { RootState } from "@reducers/index";
import { SiteData, SitesDataList } from "@reducers/dataImport/sitesDataReducer";
import useHierarchicalSites from "@hooks/core/useHierarchicalSites";
import { SiteDataForCreation } from "@custom-types/core/Sites";
import useAllSiteList from "@hooks/core/useAllSiteList";
import useValidateSitesData from "@hooks/core/useValidateSitesData";

const DataImport = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    
    const [step, setStep] = React.useState<1 | 2 | 3>(1);
    const [file, setFile] = React.useState<File | null>(null);

    const perimeterId = useSelector<RootState, number | null>(state => state.perimeter.currentPerimeter);

    const sitesDataList = useSelector<RootState, SitesDataList>(state => state.dataImport.sitesData.sitesDataList);

    const allSites = useAllSiteList({
      includeArchived: true, 
      includeSubSites: true
    });

    const allSitesName = _.map(allSites, site => site.name);

    const mainSites = useAllSiteList({
        includeArchived: false, 
        includeSubSites: false
    });
    const mainSitesName = _.map(mainSites, site => site.name);

    const sitesData = useValidateSitesData(Object.values(sitesDataList), allSitesName, mainSitesName);

    const sites: SiteDataForCreation[] = useHierarchicalSites(sitesDataList);

    return (
        <ImportLayout 
            title={upperFirst(t("site.import.import"))}
            step={step}
        >
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
                  label: upperFirst(t("site.import.resume.resume")),
                  stepNumber: 3,
                },
              ]}
            />
            {step === 1 && (
              <StepLoadData 
                file={file}
                onFileChange={setFile}
                step={step}
                disableNext={step === 1 && file === null}
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
                        mapping: siteDataKeys,
                      });
                      const sitesDataList = parsed.map(row =>
                        dataMapper(hashMapRowToRawSiteData(row))
                      );
                      dispatch(setSitesDataList({ sitesDataList }));
                    } catch (err) {
                      console.log("err import site", err);
                    }
                  }
                }}
                onCancelClick={() => {
                  dispatch(setSitesDataList({ sitesDataList: [] as SiteData[] }));
                  router.push("/userSettings/sites")
                }}
              />
            )}
            {step === 2 && (
              <StepFillData
                step={step}
                disableNext={
                  _.isEmpty(sitesData) || 
                  _.filter(sitesData, siteData => Object.values(siteData.error).includes(true)).length > 0
                }
                onNextStepClick={() => {
                  setStep(3);
                }}
                onPreviousStepClick={() => setStep(1)}
                onCancelClick={() => {
                  dispatch(setSitesDataList({ sitesDataList: [] as SiteData[] }));
                  router.push("/userSettings/sites")
                }}
              />
            )}
            {step === 3 && (
              <StepCompletion
                step={step}
                disableValidation={false}
                onNextStepClick={() => {
                  // console.log("sites => ", sites)
                  dispatch(saveSiteDataInApi({
                    perimeterId: perimeterId ?? 0,
                    siteData: sites
                  }));
                }}
                onPreviousStepClick={() => {
                  dispatch(resetSaveState());
                  setStep(2);
                }}
                onFinalizeClick={() => {
                  dispatch(resetSitesData());
                  router.push("/userSettings/sites");
                }}
                onCancelClick={() => {
                  dispatch(resetSitesData());
                  router.push("/userSettings/sites")
                }}
              />
            )}
        </ImportLayout>
    );
}

export default DataImport;
