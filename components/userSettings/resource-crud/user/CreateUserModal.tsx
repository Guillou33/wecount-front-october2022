import {
  removeCreationError,
  requestCreation,
} from "@actions/core/user/userActions";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { useMounted } from "@hooks/utils/useMounted";
import { RootState } from "@reducers/index";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import {
  getPerimeterRoleName,
  assignablePerimeterRoles,
} from "@lib/utils/perimeterRoleUtils";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateUserModal = ({ open, onClose }: Props) => {
  const dispatch = useDispatch();

  const mounted = useMounted();

  const isCreating = useSelector<RootState, boolean>(
    state => state.core.user.isCreating
  );
  const creationError = useSelector<RootState, boolean>(
    state => state.core.user.creationError
  );
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [perimeterRole, setPerimeterRole] = useState<PerimeterRole | null>(
    null
  );
  const currentPerimeter = useCurrentPerimeter();

  useEffect(() => {
    if (!open) {
      setEmail("");
      setFirstName("");
      setLastName("");
      dispatch(removeCreationError());
    }
  }, [open]);

  useEffect(() => {
    if (mounted && !isCreating && !creationError) {
      onClose();
    }
  }, [isCreating]);

  return (
    <ClassicModal open={open} onClose={onClose} small>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("user.account.email"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={email}
          type={"email"}
          placeholder={upperFirst(t("user.account.email"))}
          onHtmlChange={(value: string) => {
            setEmail(value);
            dispatch(removeCreationError());
          }}
          onLocalChange={(value: string) => {
            if (!email) {
              setEmail(value);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("user.account.firstName"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={firstName}
          placeholder={upperFirst(t("user.account.firstName"))}
          onHtmlChange={(value: string) => {
            setFirstName(value);
            dispatch(removeCreationError());
          }}
          onLocalChange={(value: string) => {
            if (!firstName) {
              setFirstName(value);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("user.account.lastName"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={lastName}
          placeholder={upperFirst(t("user.account.lastName"))}
          onHtmlChange={(value: string) => {
            dispatch(removeCreationError());
            setLastName(value);
          }}
          onLocalChange={(value: string) => {
            if (!lastName) {
              setLastName(value);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel, "mb-1")}>{upperFirst(t("user.addAs.addAs"))}</p>
      <p className={styles.modalExplanation}>
        {upperFirst(t("user.addAs.findDescription.part1"))}{" "}
        <a
          target="blank"
          href="https://www.notion.so/wecount/Quels-sont-les-diff-rents-types-d-utilisateurs-cdeeade1718e41e78d01b88820669017"
          className={styles.explanationLink}
        >
          {t("user.addAs.findDescription.part2")}
        </a>
        .
      </p>
      <div className={cx("default-field")}>
        <SelectOne selected={perimeterRole} onOptionClick={setPerimeterRole}>
          {ctx => (
            <>
              {assignablePerimeterRoles.map(role => (
                <Option {...ctx} value={role} key={role}>
                  {getPerimeterRoleName(role)}
                </Option>
              ))}
            </>
          )}
        </SelectOne>
      </div>
      {creationError && (
        <p className={cx("text-danger")}>
          {upperFirst(t("error.genericError2"))}... {upperFirst(t("error.emailFormat"))} ?
        </p>
      )}
      <div className={cx(styles.buttonCreateContainer)}>
        <ButtonSpinner
          spinnerOn={isCreating}
          disabled={!email || !firstName || !lastName || !perimeterRole}
          className={cx("button-1")}
          onClick={() => {
            if (currentPerimeter != null && perimeterRole != null) {
              dispatch(
                requestCreation({
                  email,
                  firstName,
                  lastName,
                  perimeterRole,
                  perimeterId: currentPerimeter.id,
                })
              );
            }
          }}
        >
          {upperFirst(t("user.create"))}
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default CreateUserModal;
