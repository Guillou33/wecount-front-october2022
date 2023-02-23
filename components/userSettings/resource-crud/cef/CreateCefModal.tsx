import { removeCreationError, requestCreation } from "@actions/core/product/productActions";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { useMounted } from "@hooks/utils/useMounted";
import { RootState } from "@reducers/index";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { canBeCoercedToNumber } from "@lib/utils/canBeCoercedToNumber";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { requestCEFCreation } from "@actions/core/customEmissionFactor/customEmissionFactorActions";
import { Option, SelectOne } from "@components/helpers/ui/selects";
import { CefInputUnits } from "@custom-types/core/CefInputUnits";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateCefModal = ({
  open,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  const mounted = useMounted();

  const isCreating = useSelector<RootState, boolean>(state => state.core.customEmissionFactor.isCreating);
  const creationError = useSelector<RootState, boolean>(state => state.core.customEmissionFactor.creationError);
  const [value, setValue] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [input1Name, setInput1Name] = useState<string | null>(null);
  const [input1Unit, setInput1Unit] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [comment, setComment] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setValue(null);
      setName(null);
      setInput1Name(null);
      setInput1Unit(null);
      setComment(null);
      dispatch(removeCreationError());
    }
  }, [open]);
  
  useEffect(() => {
    if (mounted && !isCreating && !creationError) {
      onClose();
    }
  }, [isCreating]);

  const canCreate = value !== null && name && input1Name && input1Unit;
  return (
    <ClassicModal
      open={open}
      onClose={onClose}
      small
    >
      <p className={cx(styles.modalLabel)}>{upperFirst(t("cef.fields.name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={name}
          placeholder={upperFirst(t("cef.fields.name"))}
          onHtmlChange={(value: string) => {
            setName(value);
            dispatch(removeCreationError());
          }}
          onLocalChange={() => {
            if (!name) {
              setName(null);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("cef.fields.value"))} ({t("footprint.emission.kgco2.kgco2e")}/{input1Unit ?? t("cef.fields.chosenUnit")})</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          type={"number"}
          className={cx("field")}
          value={value}
          placeholder={`${upperFirst(t("cef.fields.value"))} (${t("footprint.emission.kgco2.kgco2e")}/${input1Unit ?? t("cef.fields.chosenUnit")})`}
          onHtmlChange={(currentValue: string) => {
            setValue(parseFloat(currentValue));
            dispatch(removeCreationError());
          }}
          onLocalChange={() => {
            if (!value && value !== 0) {
              setValue(null);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("cef.fields.input1Name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={input1Name}
          placeholder={upperFirst(t("cef.fields.input1Name"))}
          onHtmlChange={(value: string) => {
            dispatch(removeCreationError());
            setInput1Name(value);
          }}
          onLocalChange={() => {
            if (!input1Name) {
              setInput1Name(null);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("cef.fields.input1Unit"))}</p>
      <div className={cx("default-field")}>
        <SelectOne<string>
          selected={input1Unit as string | null}
          onOptionClick={(value) => setInput1Unit(value)}
          placeholder={upperFirst(t("cef.fields.input1Unit"))}
        >
          {(ctx) => (
            <>
              {Object.values(CefInputUnits).map(
                (unit) => (
                  <Option
                    {...ctx}
                    value={t(`units.${unit}`)}
                    key={unit}
                  >
                    {t(`units.${unit}`)}
                  </Option>
                )
              )}
            </>
          )}
        </SelectOne>
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("cef.fields.source"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          className={cx("field")}
          value={source}
          placeholder={upperFirst(t("cef.fields.source"))}
          onHtmlChange={(value: string) => {
            dispatch(removeCreationError());
            setSource(value);
          }}
          onLocalChange={() => {
            if (!source) {
              setSource(null);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("cef.fields.comment"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          className={cx("field")}
          value={comment}
          placeholder={upperFirst(t("cef.fields.comment"))}
          onHtmlChange={(value: string) => {
            dispatch(removeCreationError());
            setComment(value);
          }}
          onLocalChange={() => {
            if (!comment) {
              setComment(null);
            }
          }}
        />
      </div>
      {
        creationError && (
          <p className={cx("text-danger")}>{upperFirst(t("error.genericError2"))}...</p>
        )
      }
      <div className={cx(styles.buttonCreateContainer)}>
        <ButtonSpinner
          spinnerOn={isCreating}
          disabled={!canCreate}
          className={cx("button-1")}
          onClick={() => {
            if (currentPerimeter != null && canCreate) {
              dispatch(requestCEFCreation({
                perimeterId: currentPerimeter.id,
                value: value!,
                name: name!,
                input1Name: input1Name!,
                input1Unit: input1Unit!,
                source: source ?? undefined,
                comment: comment ?? undefined,
              }));
            }
          }}
        >
          {upperFirst(t("cef.create"))}
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default CreateCefModal;
