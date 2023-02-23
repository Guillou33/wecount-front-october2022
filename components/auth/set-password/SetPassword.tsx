import { Field, reduxForm, InjectedFormProps, FormSubmitHandler } from 'redux-form';
import { useState } from 'react';
import ApiClient from '@lib/wecount-api/ApiClient';
import DefaultField from '@components/helpers/form/redux/DefaultField';
import Link from 'next/link';
import Cgvu from "./Cgvu";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import cx from 'classnames';
import styles from '@styles/core/mainForm.module.scss';
import ClassicModal from "@components/helpers/modal/ClassicModal";
import PasswordHandler, { passwordHandlerMalformedErrorMessage } from '@lib/utils/security/PasswordHandler';
import PasswordField from '@components/auth/core/PasswordField';
import { upperFirst } from 'lodash';
import { t } from 'i18next';
import { guessLocale } from '@lib/translation/config/languageDetector';

interface Props {
  resetToken: string;
  existingResetToken: boolean;
};
interface Fields {
  password?: string;
  checkCgvu?: boolean;
};
const SetPassword = (props: Props & InjectedFormProps<Fields, Props>) => {
  const [mainError, setMainError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);

  const [modalCgvu, setModalCgvu] = useState(false);

  const renderModalCgvu = () => {
    return (
      <ClassicModal
        open={modalCgvu}
        onClose={() => {
          setModalCgvu(false);
        }}
        small={false}
      >
        <Cgvu />
      </ClassicModal>
    );
  }

  const readCgvu = () => {
    setModalCgvu(true);
  }

  const renderInexistantResetToken = () => {
    if (props.existingResetToken) return;

    return (
      <div>
        <p className="text-danger">
          {upperFirst(t("user.account.validation.inexistantResetToken"))} ?
        </p>
      </div>
    );
  }

  const renderMainErrors = (error: string | undefined) => {
    if (!error) return;

    return (
      <p className="text-danger">
        {error}
      </p>
    );
  }

  const renderSuccess = () => {
    if (!success) return;
    return (
      <div className="text-center">
        <p className="color-1">{upperFirst(t("user.account.validation.passwordCreated"))} !</p>
        <Link href="/login"><button className="button-2">{upperFirst(t("user.account.connection"))}</button></Link>
      </div>
    );
  }
  const renderMain = () => {
    if (success) return;
    return (
      <form
        onSubmit={props.handleSubmit(onSubmit(setMainError, setSuccess, props.resetToken))}
        onClick={() => { setMainError(undefined) }}
      >
        <PasswordField />
        <div className={cx(styles.chkCgvuField)}>
          <Field
            className={cx(styles.chkCgvu, "default-field")}
            type="checkbox"
            id="checkCgvu"
            name="checkCgvu"
            defaultValue={false}
            component={
              DefaultField
            }
          />
          <label htmlFor="checkGgvu" className={cx(styles.paragraphCgvu)}>
            {upperFirst(t("user.account.validation.cgvu.part1"))}{" "}
            <span
              className={cx(styles.openCgvu)}
              onClick={() => readCgvu()}>
                {t("user.account.validation.cgvu.part2")}.
            </span>
          </label>
        </div>
        <div className={cx(styles.buttonSubmitContainer)}>
          <ButtonSpinner type="submit" className="button-1" spinnerOn={props.submitting}>
            {upperFirst(t("global.validate"))}
          </ButtonSpinner>
        </div>
      </form>
    );
  }

  return (
    <div className={cx(styles.main, styles.bgBlue)}>
      <div className={cx(styles.mainFormContainer)}>
        <h1 className="title-2 color-1 text-center mb-5">{upperFirst(t("user.account.choosePassword"))} :</h1>
        {renderInexistantResetToken()}
        {props.existingResetToken ? renderMainErrors(mainError) : null}
        {props.existingResetToken ? renderSuccess() : null}
        {props.existingResetToken ? renderMain() : null}
        {renderModalCgvu()}
      </div>
    </div>
  );
};

const onSubmit = (setMainError: Function, setSuccess: Function, resetToken: string): FormSubmitHandler<Fields, Props> => {
  return async (values, dispatch) => {
    try {
      const apiClient = ApiClient.buildFromBrowser();
      await apiClient.post<{}>(`/auth/set-password/${resetToken}`, {
        password: values.password!,
        acceptCgvu: 1,
        locale: (await guessLocale()),
      }, false);

      setSuccess(true);
    } catch (error: any) {
      console.log(error.response);
      console.log(error.response?.data?.errors[0]?.field);

      if (error.response?.status === 400 && (error.response?.data?.errors[0]?.field === 'password' || error.response?.message === "Password is malformed")) {
        setMainError(upperFirst(t("user.account.validation.charactersLengthPassword")));
      } else if (error.response?.status === 400 && error.response?.data?.errors[0]?.message === 'Password is malformed') {
        setMainError(passwordHandlerMalformedErrorMessage);
      } else {
        setMainError(upperFirst(t("error.unknownError")));
      }
    }
  };
}

type Errors = {
  [key in keyof Fields]: string
}
const validate = (values: Fields): Errors => {
  const errors: Errors = {};

  if (!values.password) {
    errors.password = upperFirst(t("user.account.validation.emptyPasswordField"));
  }

  if (values.password && !PasswordHandler.securityLevelAccepted(values.password)) {
    errors.password = passwordHandlerMalformedErrorMessage;
  }

  if (!values.checkCgvu) {
    errors.checkCgvu = upperFirst(t("user.account.validation.checkCgvu"))
  }

  return errors;
}

const SetPasswordForm = reduxForm<Fields, Props>({
  form: 'set_password',
  validate
})(SetPassword);

export default SetPasswordForm;
