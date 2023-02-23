
interface ButtonSpinnerProps {
  spinnerOn: boolean;
  children: any;
  [key: string]: any;
}

export const ButtonSpinner = (props: ButtonSpinnerProps) => {
  const renderSpinner = () => {
    return <i className="base-spinner fas fa-spinner fa-spin"></i>;
  }

  const transferedProps: Partial<ButtonSpinnerProps> = { ...props };
  delete transferedProps.spinnerOn;
  delete transferedProps.children;
  
  return (
    <button {...transferedProps}>
      {props.spinnerOn ? renderSpinner() : props.children}
    </button>
  );
}