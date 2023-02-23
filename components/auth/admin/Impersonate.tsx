import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import AuthLayout from '@components/layout/AuthLayout';
import { Field, reduxForm, InjectedFormProps, FormSubmitHandler } from 'redux-form';
import DefaultField from '@components/helpers/form/redux/DefaultField';
import { adminImpersonate } from '@actions/auth/authActions';
import { ButtonSpinner } from '@components/helpers/form/button/Buttons';
import ApiClient from '@lib/wecount-api/ApiClient';
import { loginRedirect } from '@lib/core/auth/loginRedirect';
import { useRouter } from 'next/router';
import _, { upperFirst } from 'lodash';
import EmailValidator from 'email-validator';
import styles from '@styles/auth/admin/mainForm.module.scss';
import { t } from 'i18next';

interface Props extends InjectedFormProps<Fields> { };

interface Fields {
  email?: string
};

const Impersonate = (props: Props) => {

  const [mainError, setMainError] = useState<string | undefined>();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSubmit: FormSubmitHandler<Fields> = async (values) => {
    setMainError(undefined);
    try {
      await dispatch(adminImpersonate({
        email: values.email!,
      }));

      const apiClient = ApiClient.buildFromBrowser(false);
      const redirectInfo = await loginRedirect(apiClient);
      router.push(redirectInfo.path, redirectInfo.as);

    } catch (e: any) {
      if (e.response?.status === 404) {
        setMainError(`${upperFirst(t("user.account.validation.nonExistingEmail"))}`);
        return;
      }
      setMainError(`${upperFirst(t("user.account.validation.errorCreation"))}...`);
    }
  }

  return (
    <AuthLayout>
      <h1 className={cx("title-1 color-1")}>{upperFirst(t("user.role.title.admin"))} - {upperFirst(t("user.account.otherAccount.connectionToAccount"))}</h1>
      <div className={cx(styles.main)}>

        <div className={cx(styles.mainFormContainer)}>
          <form
            onSubmit={props.handleSubmit(onSubmit)}
          >
            <p className={cx("title-3 color-1 mb-4")}>{upperFirst(t("user.account.otherAccount.emailAccount"))}</p>
            <Field className="default-field" name="email" placeholder={upperFirst(t("user.account.email"))} component={DefaultField} />
            <div className={cx(styles.buttonSubmitContainer)}>
              {
                !mainError ? null : (
                  <p className={cx("text-danger")}>{mainError}</p>
                )
              }
              <ButtonSpinner type="submit" className={cx("button-1", styles.buttonSubmit)} spinnerOn={props.submitting}>
                {upperFirst(t("user.account.connection"))}
              </ButtonSpinner>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}

type Errors = {
  [key in keyof Fields]: string
}
const validate = (values: Fields): Errors => {
  const errors: Errors = {};

  const requiredFields: {
    name: keyof Fields,
    printName: string
  }[] = [
      {
        name: 'email',
        printName: 'email',
      },
    ];

  requiredFields.forEach((requiredField) => {
    if (!values[requiredField.name]) {
      // errors[requiredField.name] = `${_.upperFirst(requiredField.printName)} must be filled`;
      errors[requiredField.name] = `${upperFirst(t("user.account.validation.emptyField"))}`;
    }
  });

  if (!EmailValidator.validate(values.email ?? '')) {
    errors.email = `${upperFirst(t("user.account.validation.incorrectEmail"))}`;
  }

  return errors;
}

const ImpersonateWithForm = reduxForm({
  form: 'new-account',
  validate
})(Impersonate);

export default ImpersonateWithForm;