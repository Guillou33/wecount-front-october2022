import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import styles from "@styles/dashboard/campaign/sub/indicatorTable.module.scss";

import { RootState } from "@reducers/index";
import { requestPerimeterUpdate } from "@actions/perimeter/perimeterActions";

import { PerimeterResponse } from "@lib/wecount-api/responses/apiResponses";

import ClassicModal from "@components/helpers/modal/ClassicModal";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";

import { upperFirst } from "lodash";
import { t } from "i18next";

type PerimeterData = {
  id: number;
  name: string;
  description: string | null;
};

type PartialData = Partial<PerimeterData>;

interface Props {
  perimeterId: number | null;
  onClose: () => void;
}

const EditPerimeterModale = ({ perimeterId, onClose }: Props) => {
  const dispatch = useDispatch();
  const editedPerimeter = useSelector<RootState, PerimeterResponse | null>(
    state =>
      perimeterId != null ? state.perimeter.perimeters[perimeterId] : null
  );
  const { name = "", description = null } = editedPerimeter ?? {};

  const updatePerimeter = (data: PartialData) => {
    if (editedPerimeter !== null && perimeterId !== null) {
      const updateData = {
        ...editedPerimeter,
        ...data,
        id: perimeterId,
      };
      dispatch(requestPerimeterUpdate(updateData));
    }
  };

  return (
    <ClassicModal open={editedPerimeter !== null} onClose={onClose} small>
      <label htmlFor="perimeter-name-edition" className={styles.modalLabel}>
        {upperFirst(t("perimeter.name"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledInput
          id="perimeter-name-edition"
          className={cx("field")}
          value={name}
          placeholder={upperFirst(t("perimeter.name"))}
          onHtmlChange={(name: string) => {
            updatePerimeter({ name });
          }}
        />
      </div>
      <label
        htmlFor="perimeter-description-edition"
        className={styles.modalLabel}
      >
        {upperFirst(t("perimeter.description"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          id="perimeter-description-edition"
          className={cx("field")}
          value={description}
          placeholder={upperFirst(t("perimeter.description"))}
          onHtmlChange={(description: string) => {
            updatePerimeter({ description });
          }}
        />
      </div>
      <div className={styles.validationButtonContainer}>
        <button
          className={cx("button-2")}
          onClick={() => {
            onClose();
          }}
        >
          Ok
        </button>
      </div>
    </ClassicModal>
  );
};

export default EditPerimeterModale;
