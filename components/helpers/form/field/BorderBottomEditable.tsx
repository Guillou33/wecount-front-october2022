import { useState } from 'react';
import EditableText, { Props as EditableTextProps } from '@components/helpers/form/field/EditableText';
import cx from 'classnames';
import styles from '@styles/helpers/form/field/borderBottomEditable.module.scss';

interface Props extends Partial<EditableTextProps> {
  pencilClassName?: string;
  value: string | undefined | null;
  iconClass?: string;
}

const BorderBottomEditable = (props: Props) => {
  const [forceEdit, setForceEdit] = useState(false);

  const onStartEdit = () => {
    setForceEdit(true);
    if (props.onStartEdit) {
      props.onStartEdit();
    }
  }
  const onEndEdit = (value: string) => {
    setForceEdit(false);
    if (props.onEndEdit) {
      props.onEndEdit(value);
    }
  }

  return (
    <div className={styles.main}>
      <EditableText
        {...props}
        onEndEdit={onEndEdit}
        onStartEdit={onStartEdit}
        forceEdit={forceEdit}
      />
      {
        (forceEdit || !(props.value)) ? null : (
            <i onClick={() => setForceEdit(true)} className={cx(props.iconClass ?? "fas fa-pen", props.pencilClassName)}></i>
        )
      }
    </div>
  );
}

export default BorderBottomEditable;
