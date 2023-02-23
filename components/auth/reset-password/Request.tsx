import { Field, reduxForm, InjectedFormProps, FormSubmitHandler } from 'redux-form';
import { useState } from 'react';
import ApiClient from '@lib/wecount-api/ApiClient';
import DefaultField from '@components/helpers/form/redux/DefaultField';
import { ButtonSpinner } from "@components/helpers/form/button/Buttons"
import cx from 'classnames';
import styles from '@styles/core/mainForm.module.scss'
import { t } from 'i18next';
import { upperFirst } from 'lodash';

interface Props extends InjectedFormProps<Fields> { };
interface Fields {
  email?: string
};
const Request = (props: Props) => {
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [success, setSuccess] = useState<boolean>(false);

  const renderSuccess = () => {
    if (!success) return;
    return (
      <p className="color-1">{upperFirst(t("user.account.validation.linkResetToken"))}.</p>
    );
  }

  const renderMainErrors = (emailError: string | undefined) => {
    if (!emailError) return;

    return (
      <p className="text-danger">
        {emailError}
      </p>
    );
  }

  const renderForm = () => {
    if (success) return;

    return (
      <form
        onSubmit={props.handleSubmit(onSubmit(setEmailError, setSuccess))}
        onClick={() => { setEmailError(undefined) }}
      >
        <Field className="default-field" name="email" component={DefaultField} />
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
        <h1 className="title-2 color-1 text-center mb-5">{upperFirst(t("user.account.enterEmail"))} :</h1>
        {renderMainErrors(emailError)}
        {renderSuccess()}
        {renderForm()}
      </div>
    </div>
  );
};

const onSubmit = (setEmailError: Function, setSuccess: Function): FormSubmitHandler<Fields> => {
  return async (values) => {
    try {
      const apiClient = ApiClient.buildFromBrowser();
      await apiClient.post<{}>('/auth/reset-password/send', {
        email: values.email!,
      }, false);

      setSuccess(true);
    } catch (error: any) {
      console.log(error);
      console.log(error.response);

      if (error.response && error.response.status === 400) {
        setEmailError(upperFirst(t("user.userNotFound")));
      } else {
        setEmailError(upperFirst(t("error.unknownError")));
      }
    }
  };
}

type Errors = {
  [key in keyof Fields]: string
}
const validate = (values: Fields): Errors => {
  const errors: Errors = {};

  if (!values.email) {
    errors.email = upperFirst(t("user.account.validation.emptyEmailField"));
  }

  return errors;
}

const RequestForm = reduxForm({
  form: 'reset_password_request',
  validate
})(Request);

export default RequestForm;
