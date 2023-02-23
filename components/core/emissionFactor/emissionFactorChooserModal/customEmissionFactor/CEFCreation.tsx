import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/customEmissionFactor/cefCreation.module.scss";
import useTranslate from "@hooks/core/translation/useTranslate";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import { upperFirst } from "lodash";
import { useEffect, useState } from "react";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { requestCEFCreation } from "@actions/core/customEmissionFactor/customEmissionFactorActions";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { RootState } from "@reducers/index";
import { useMounted } from "@hooks/utils/useMounted";
import { Option, SelectOne } from "@components/helpers/ui/selects";
import { CefInputUnits } from "@custom-types/core/CefInputUnits";
interface Props {
  onBackToList: () => void;
}

const CEFCreation = ({ onBackToList }: Props) => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter()!;
  const mounted = useMounted();

  const isCreating = useSelector<RootState, boolean>(
    (state) => state.core.customEmissionFactor.isCreating
  );

  const [value, setValue] = useState<number | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [input1Name, setInput1Name] = useState<string | null>(null);
  const [input1Unit, setInput1Unit] = useState<string | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const [comment, setComment] = useState<string | null>(null);

  const canCreate = value !== null && name && input1Name && input1Unit;

  const onTryCreate = () => {
    if (!canCreate) return;
    dispatch(
      requestCEFCreation({
        perimeterId: currentPerimeter.id,
        value: value!,
        name: name!,
        input1Name: input1Name!,
        input1Unit: input1Unit!,
        source: source ?? undefined,
        comment: comment ?? undefined,
      })
    );
  };

  useEffect(() => {
    if (mounted && !isCreating) {
      onBackToList();
    }
  }, [isCreating]);

  return (
    <div className={cx(styles.main)}>
      <div className={cx(styles.header)}>
        <div className={cx(styles.backArrowContainer)}>
          <i onClick={onBackToList} className={cx("fa fa-arrow-left")} />
        </div>
        <p className={styles.titleCreation}>
          <strong>
            {upperFirst(
              t("emissionFactorChoice.cef.createCustomEmissionFactor")
            )}
          </strong>
        </p>
      </div>
      <div className={cx(styles.formContainer)}>
        <div className={cx(styles.fieldsContainer)}>
          <p className={cx(styles.label)}>{upperFirst(t("cef.fields.name"))}</p>
          <div className={cx("default-field")}>
            <SelfControlledInput
              className="field"
              placeholder={upperFirst(t("cef.fields.name"))}
              value={name}
              onHtmlChange={(value) => setName(value)}
            />
          </div>
          <p className={cx(styles.label)}>{upperFirst(t("cef.fields.value"))}</p>
          <div className={cx("default-field")}>
            <SelfControlledInput
              type="number"
              className="field"
              placeholder={`${upperFirst(t("cef.fields.value"))} (${t("footprint.emission.kgco2.kgco2e")}/${input1Unit ?? t("cef.fields.chosenUnit")})`}
              value={value}
              onHtmlChange={(fieldValue) => setValue(parseFloat(fieldValue))}
            />
          </div>
          <p className={cx(styles.label)}>{upperFirst(t("cef.fields.input1Name"))}</p>
          <div className={cx("default-field")}>
            <SelfControlledInput
              className="field"
              placeholder={upperFirst(
                t("cef.fields.input1Name")
              )}
              value={input1Name}
              onHtmlChange={(value) => setInput1Name(value)}
            />
          </div>
          <p className={cx(styles.label)}>{upperFirst(t("cef.fields.input1Unit"))}</p>
          <div className={cx("default-field")}>
            <SelectOne<string>
              className={cx(styles.unitSelector)}
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
          <p className={cx(styles.label)}>{upperFirst(t("cef.fields.source"))}</p>
          <div className={cx("default-field")}>
            <SelfControlledTextarea
              className={cx("field")}
              value={source}
              placeholder={upperFirst(t("cef.fields.source"))}
              onHtmlChange={(value) => setSource(value)}
            />
          </div>
          <p className={cx(styles.label)}>{upperFirst(t("cef.fields.comment"))}</p>
          <div className={cx("default-field")}>
            <SelfControlledTextarea
              className={cx("field")}
              value={comment}
              placeholder={upperFirst(t("cef.fields.comment"))}
              onHtmlChange={(value) => setComment(value)}
            />
          </div>
          <div className={cx(styles.buttonConfirmContainer)}>
            <ButtonSpinner
              className={cx("button-1")}
              onClick={onTryCreate}
              spinnerOn={isCreating}
              disabled={!canCreate}
            >
              {upperFirst(t("global.add"))}
            </ButtonSpinner>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEFCreation;
