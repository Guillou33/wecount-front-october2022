import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import AuthLayout from '@components/layout/AuthLayout';
import { Field, reduxForm, InjectedFormProps, FormSubmitHandler } from 'redux-form';
import DefaultField from '@components/helpers/form/redux/DefaultField';
import { adminCreateAccount } from '@actions/auth/authActions';
import { ButtonSpinner } from '@components/helpers/form/button/Buttons';
import { useTempShow } from '@hooks/utils/useTempShow';
import _, { upperFirst } from 'lodash';
import EmailValidator from 'email-validator';
import styles from '@styles/auth/admin/mainForm.module.scss';
import { convertLanguageToLocale, convertLocaleToLanguage, defaultLocale, LANGUAGE } from '@lib/translation/config/Locale';
import { Option, SelectOne } from '@components/helpers/ui/selects';
import { t } from 'i18next';

interface Props extends InjectedFormProps<Fields> { };

interface Fields {
  email?: string;
  companyName?: string;
  firstName?: string;
  lastName?: string;
  language?: LANGUAGE;
};

const NewAccount = (props: Props) => {

  const [successIsShown, showSuccess] = useTempShow();
  const [mainError, setMainError] = useState<string | undefined>();
  const dispatch = useDispatch();
  const [language, setLanguage] = useState<LANGUAGE>(convertLocaleToLanguage(defaultLocale))

  const onSubmit: FormSubmitHandler<Fields> = async (values) => {
    setMainError(undefined);
    try {
      await dispatch(adminCreateAccount({
        email: values.email!,
        companyName: values.companyName!,
        firstName: values.firstName!,
        lastName: values.lastName!,
        locale: convertLanguageToLocale(language),
      }));

      props.reset();
      showSuccess();
    } catch (e: any) {
      if (e.response?.status === 400 && e.response.data?.errors?.length) {
        const firstError = e.response.data?.errors[0];
        if (firstError.message === "existing_email") {
          setMainError(`${upperFirst(t("user.account.validation.existingEmail"))} !`);
          return;
        }
      }
      setMainError(`${upperFirst(t("user.account.validation.errorCreation"))}...`);
    }
  }
  const languageTranslated = {
    [LANGUAGE.FR]: t("global.adjective.language.french"),
    [LANGUAGE.EN]: t("global.adjective.language.english")
  };

  return (
    <AuthLayout>
      <h1 className={cx("title-1 color-1")}>{upperFirst(t("user.role.title.admin"))} - {upperFirst(t("user.account.new.creation"))}</h1>
      <div className={cx(styles.main)}>

        <div className={cx(styles.mainFormContainer)}>
          <form
            onSubmit={props.handleSubmit(onSubmit)}
          >
            <p className={cx("title-3 color-1 mb-5")}>{upperFirst(t("user.account.new.info"))}</p>
            <Field className="default-field" name="email" placeholder={upperFirst(t("user.account.email"))} component={DefaultField} />
            <Field className="default-field" name="companyName" placeholder={upperFirst(t("user.account.company"))} component={DefaultField} />
            <Field className="default-field" name="firstName" placeholder={upperFirst(t("user.account.firstName"))} component={DefaultField} />
            <Field className="default-field" name="lastName" placeholder={upperFirst(t("user.account.lastName"))} component={DefaultField} />
            <SelectOne
              className={cx(styles.languageSelector)}
              selected={language}
              onOptionClick={(languageValue) => {
                setLanguage(languageValue);
              }}
            >
              {(ctx) => (
                <>
                  {Object.values(LANGUAGE).map(
                    (language) => (
                      <Option
                        {...ctx}
                        value={language}
                        key={language}
                      >
                        <span>{upperFirst(t("user.account.email"))} {t("global.other.in2")} {languageTranslated[language]}</span>
                      </Option>
                    )
                  )}
                </>
              )}
            </SelectOne>
            <div className={cx(styles.buttonSubmitContainer)}>
              {
                !mainError ? null : (
                  <p className={cx("text-danger")}>{mainError}</p>
                )
              }
              <p className={cx("color-1", styles.successText, { [styles.isShown]: successIsShown })}>{upperFirst(t("user.account.validation.userCreated"))} !</p>
              <ButtonSpinner type="submit" className={cx("button-1", styles.buttonSubmit)} spinnerOn={props.submitting}>
                {upperFirst(t("global.create"))}
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
      {
        name: 'companyName',
        printName: 'company',
      },
      {
        name: 'firstName',
        printName: 'first name',
      },
      {
        name: 'lastName',
        printName: 'last name',
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

const NewAccountWithForm = reduxForm({
  form: 'new-account',
  validate
})(NewAccount);

export default NewAccountWithForm;