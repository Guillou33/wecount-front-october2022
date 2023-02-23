import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useDispatch } from "react-redux";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { CustomEmissionFactor } from "@reducers/core/customEmissionFactorReducer";
import { useEffect, useState } from "react";
import { requestCEFUpdate } from "@actions/core/customEmissionFactor/customEmissionFactorActions";
import customEmissionFactors from "pages/userSettings/custom-emission-factors";
import { Option, SelectOne } from "@components/helpers/ui/selects";
import { CefInputUnits } from "@custom-types/core/CefInputUnits";

interface Props {
  editingCef: CustomEmissionFactor | undefined;
  onClose: () => void;
}

const EditCefModal = ({
  editingCef,
  onClose,
}: Props) => {
  const dispatch = useDispatch();

  const [value, setValue] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [input1Name, setInput1Name] = useState<string | null>(null);
  const [input1Unit, setInput1Unit] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [comment, setComment] = useState<string | null>(null);

  useEffect(() => {
    setValue(editingCef?.value ?? null);
    setName(editingCef?.name ?? null);
    setInput1Name(editingCef?.input1Name ?? null);
    setInput1Unit(editingCef?.input1Unit ?? null);
    setSource(editingCef?.source ?? null);
    setComment(editingCef?.comment ?? null);
  }, [editingCef?.id]);

  const canUpdate = value !== null && name && input1Name && input1Unit;
  return (
    <ClassicModal
      open={!!editingCef}
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
            setComment(value);
          }}
          onLocalChange={() => {
            if (!comment) {
              setComment(null);
            }
          }}
        />
      </div>
      <div className={cx(styles.buttonUpdateContainer)}>
        <ButtonSpinner
          spinnerOn={false}
          disabled={!canUpdate}
          className={cx("button-2")}
          onClick={() => {
            if (canUpdate) {
              dispatch(requestCEFUpdate({
                cefId: editingCef!.id,
                value: value!,
                name: name!,
                input1Name: input1Name!,
                input1Unit: input1Unit!,
                source: source ?? undefined,
                comment: comment ?? undefined,
              }));
            }
            onClose();
          }}
        >
          Ok
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default EditCefModal;
