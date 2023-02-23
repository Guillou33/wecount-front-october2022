import cx from "classnames";
import styles from "@styles/campaign/detail/trajectory/helpers/fakeInput.module.scss";

interface Props extends React.HTMLProps<HTMLDivElement> {
  children?: string | null;
  placeholder?: string;
}

const FakeInput = ({ children, placeholder, ...rest }: Props) => {
  return (
    <div
      className={cx(styles.fakeInput, { [styles.empty]: !children })}
      {...rest}
    >
      {children || placeholder}
    </div>
  );
};

export default FakeInput;
