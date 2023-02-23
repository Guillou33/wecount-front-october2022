import styles from '@styles/auth/login.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@reducers/index';
import { login, loginResetErrors } from '@actions/auth/authActions';
import { Field, reduxForm, InjectedFormProps, FormSubmitHandler } from 'redux-form';
import { useRouter, NextRouter } from 'next/router';
import { CustomThunkDispatch } from '@custom-types/redux'
import { AuthState } from '@reducers/authReducer';
import ApiClient from '@lib/wecount-api/ApiClient';
import Link from 'next/link';
import DefaultField from '@components/helpers/form/redux/DefaultField';
import { ButtonSpinner } from '@components/helpers/form/button/Buttons';
import { loginRedirect } from '@lib/core/auth/loginRedirect';
import PasswordField from '@components/auth/core/PasswordField';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

interface Props extends InjectedFormProps<Fields> { };

interface Fields {
  email?: string
  password?: string
};

const Login = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch() as CustomThunkDispatch;
  const authState = useSelector<RootState, AuthState>(state => state.auth);

  return (
    <div className={styles.main}>
      <div className={styles.loginFormContainer}>
        <h1 className="title-2 text-center mb-5">{upperFirst(t("user.account.connection"))}</h1>
        <form
          onSubmit={props.handleSubmit(onSubmit(dispatch, router))}
          onClick={() => { dispatch(loginResetErrors()) }}
        >
          {renderMainErrors(authState)}
          <Field className="default-field" type="email" name="email" placeholder={upperFirst(t("user.account.email"))} component={DefaultField} />
          <PasswordField />
          <div className={styles.bottomForm}>
            <ButtonSpinner type="submit" className="button-1" spinnerOn={props.submitting}>
              {upperFirst(t("user.account.login"))}
            </ButtonSpinner>
            <Link href="/reset-password/request"><a>{upperFirst(t("user.account.validation.forgottenPassword"))} ?</a></Link>
          </div>
        </form>
      </div>
    </div>
  );
};

const renderMainErrors = (authState: AuthState) => {
  return (
    <p className="text-danger">
      {authState.loginErrors.emailError ? upperFirst(t("user.account.validation.incorrectEmailFormat")) : null}
      {authState.loginErrors.passwordError ? upperFirst(t("user.account.validation.charactersLengthPassword")) : null}
      {authState.loginErrors.badCredentialsError ? upperFirst(t("user.account.validation.badCredentialsError")) : null}
      {authState.loginErrors.tooManyPasswordErrors ? upperFirst(t("user.account.validation.tooManyPasswordErrors")) : null}
      {authState.loginErrors.genericError ? upperFirst(t("error.genericError1")) : null}
    </p>
  );
}

const onSubmit = (dispatch: CustomThunkDispatch, router: NextRouter): FormSubmitHandler<Fields> => {
  return async (values) => {
    if (!values.email || !values.password) {
      return;
    }
    await dispatch(login({
      email: values.email,
      password: values.password,
      onSuccess: async () => {
        const apiClient = ApiClient.buildFromBrowser(false);

        const redirectInfo = await loginRedirect(apiClient);

        router.push(redirectInfo.path, redirectInfo.as);
      }
    }));

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

const LoginWithForm = reduxForm({
  form: 'login',
  validate
})(Login);

export default LoginWithForm;
