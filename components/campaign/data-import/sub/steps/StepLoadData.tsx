import { t } from "i18next";
import { upperFirst } from "lodash";

import FileInput from "@components/helpers/ui/FileInput";
import Step from "./Step";

import styles from "@styles/campaign/data-import/sub/steps/stepLoadData.module.scss";

interface Props {
  file: File | null;
  onFileChange: (file: File) => void;
  onNextStepClick: () => void;
  onCancelClick: () => void;
}

const StepLoadData = ({
  file,
  onFileChange,
  onNextStepClick,
  onCancelClick,
}: Props) => {
  return (
    <Step
      title={upperFirst(t("dataImport.steps.load.title"))}
      content={
        <>
          <p>
            {upperFirst(t("dataImport.steps.load.description1"))}{" "}
            <a
              href="https://www.notion.so/wecount/Comment-importer-mes-donn-es-dans-la-plateforme-cba84d427feb490186268c652e5a9671"
              target="blank"
            >
              {t("dataImport.common.link")}
            </a>{" "}
            {t("dataImport.steps.load.description2")}
          </p>
          <FileInput
            value={file}
            onChange={onFileChange}
            className={styles.fileInput}
            accept={[".xlsx"]}
          />
        </>
      }
      bottomBar={
        <div className={styles.loadDataBottomBar}>
          <button className="button-2" onClick={onCancelClick}>
            {upperFirst(t("dataImport.common.cancel"))}
          </button>
          <button
            className={"button-2"}
            disabled={file === null}
            onClick={() => {
              if (file !== null) {
                onNextStepClick();
              }
            }}
          >
            {upperFirst(t("dataImport.common.next"))}
          </button>
        </div>
      }
    />
  );
};

export default StepLoadData;
