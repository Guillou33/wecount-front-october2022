import { WrappedFieldProps } from 'redux-form';
import cx from 'classnames';
import { useState } from 'react';
import styles from "@styles/helpers/form/redux/defaultField.module.scss";
import { upperFirst } from 'lodash';
import { t } from 'i18next';

interface CustomWrapFieldProps extends WrappedFieldProps {
  className?: string;
  placeholder?: string;
  type?: string;
  withEyeViewer?: boolean;
}

const DefaultField = (formProps: CustomWrapFieldProps) => {
  let error: JSX.Element | undefined = undefined;
  let hasError = false;

  if (formProps.meta.touched && formProps.meta.error) {
    error = <p className="error-message">{formProps.meta.error}</p>;
    hasError = true;
  }

  const [isVisible, setIsVisible] = useState(false);

  const onEyeClick = (e: any) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  }

  const renderEyeViewer = () => {
    return isVisible ? (
      <div className={cx(styles.eyeViewerLinkContainer)}>
        <a className={cx(styles.eyeViewerLink)} onClick={onEyeClick}><i className={cx("fas fa-eye-slash")}></i> {upperFirst(t("global.hide"))}</a>
      </div>
    ) : (
      <div className={cx(styles.eyeViewerLinkContainer)}>
        <a className={cx(styles.eyeViewerLink)} onClick={onEyeClick}><i className={cx("fas fa-eye")}></i> {upperFirst(t("global.see"))}</a>
      </div>
    )
  };

  const inputType = formProps.type === "password" && isVisible ? "text" : formProps.type;
  return (
    <>
      <div className={cx(formProps.className)}>
        <input className={cx("field", { error: hasError })} type={inputType} placeholder={formProps.placeholder} autoComplete="off" {...formProps.input} />
        {formProps.withEyeViewer && renderEyeViewer()}
        <p style={{ marginTop: formProps.type === "checkbox" ? 10 : 0, width: "15vw" }}>{error}</p>
      </div>
    </>
  );
}

export default DefaultField;