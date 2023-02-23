import cx from "classnames";
import useTranslate from "@hooks/core/translation/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { CustomEmissionFactor, CustomEmissionFactorList } from "@reducers/core/customEmissionFactorReducer";
import { setModalOpen, updateLastChoice } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import CEFItem from "./CEFItem";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/customEmissionFactor/cefList.module.scss";
import { upperFirst } from "lodash";
import selectActiveCEFs from "@selectors/customEmissionFactor/selectActiveCEFs";

interface Props {
  onClickCreate: () => void;
}

const CEFList = ({
  onClickCreate,
}: Props) => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const activeCefList = useSelector<RootState, CustomEmissionFactor[]>(selectActiveCEFs)

  const onChoose = (cef: CustomEmissionFactor) => {
    dispatch(updateLastChoice({
      customEmissionFactorId: cef.id,
    }));
    dispatch(setModalOpen(false));
  }

  return (
    <div className={cx(styles.main)}>
      {
        !!activeCefList.length && (
          <div className={cx(styles.btnAddContainer)}>
            <ButtonSpinner
              spinnerOn={false}
              onClick={onClickCreate}
              className={cx("button-1")}
            >
              <i className="fa fa-plus"></i> {upperFirst(t("global.add"))}
            </ButtonSpinner>
          </div>
        )
      }
      {
        !activeCefList.length && (
          <div className={cx(styles.emptyContainer)}>
            <div className={cx(styles.createFirstButtonContainer)}>
            <ButtonSpinner
              spinnerOn={false}
              onClick={onClickCreate}
              className={cx("button-1")}
            >
              <i className="fa fa-plus"></i> {upperFirst(t("cef.addFirst"))}
            </ButtonSpinner>
            </div>
          </div>
        )
      }
      {
        activeCefList.map(cef => (
          <CEFItem cef={cef} onClick={(cef) => onChoose(cef)}/>
        ))
      }
    </div>
  );
};

export default CEFList;
