import { t } from "i18next";
import { upperFirst } from "lodash";

import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";

interface Props {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ExitModalConfirm = ({ open, onClose, onConfirm }: Props) => {
  return (
    <DangerConfirmModal
      open={open}
      onConfirm={onConfirm}
      onClose={onClose}
      small
      btnText={upperFirst(t("dataImport.common.exit"))}
      question={upperFirst(t("dataImport.exitModaleQuestion"))}
    />
  );
};

export default ExitModalConfirm;
