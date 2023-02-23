import { useState } from 'react';
import { Field } from 'redux-form';
import DefaultField from '@components/helpers/form/redux/DefaultField';
import cx from "classnames";
import { upperFirst } from 'lodash';
import { t } from 'i18next';

const PasswordField = () => {
  return <Field className={cx("default-field")} type="password" placeholder={upperFirst(t("user.account.password"))} name="password" withEyeViewer component={DefaultField} />;
};


export default PasswordField;
