import { useState, useEffect, useRef } from "react";
import { useRefState } from "@hooks/utils/useRefState";
import styles from "@styles/helpers/form/field/editableText.module.scss";
import { FiEdit2 } from 'react-icons/fi';

export interface Props {
  value: string | undefined | null;
  placeholder?: string;
  onEndEdit?: (value: string) => void;
  onStartEdit?: Function;
  placeholderClassName?: string;
  textClassName?: string;
  inputClassName?: string;
  className?: string;
  inputType?: string;
  forceEdit?: boolean;
  forceNotEmpty?: boolean;
  refreshValueOnEditEnd?: boolean;
  hideIconWhenEditing?: boolean;
}

const EditableText = ({
  value,
  placeholder,
  placeholderClassName,
  textClassName,
  className,
  inputClassName,
  inputType,
  onEndEdit,
  onStartEdit,
  forceEdit,
  forceNotEmpty,
  refreshValueOnEditEnd = false,
  hideIconWhenEditing = false,
}: Props) => {
  const [editing, setEditing] = useState(!!forceEdit);
  const [localValue, refLocalValue, setLocalValue] = useRefState<string>(value ?? '');
  const ref = useRef<any>();

  useEffect(() => {
    const endEditOnEnterKeyPress = (e: any) => {
      // Number 13 is the "Enter" key on the keyboard
      if (e.keyCode === 13) {
        e.preventDefault();
        onBlur();
      }
    }
    if (ref.current) {
      ref.current.removeEventListener("keydown", endEditOnEnterKeyPress);
      ref.current.addEventListener("keydown", endEditOnEnterKeyPress);
    }
  }, [editing])

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value])

  useEffect(() => {
    setEditing(!!forceEdit);
  }, [forceEdit])

  const onBlur = () => {
    setEditing(false);
    let newLocalValue = refLocalValue.current;
    if (forceNotEmpty && !localValue) {
      newLocalValue = value ?? '';
      setLocalValue(newLocalValue);
    }
    if (onEndEdit) {
      onEndEdit(newLocalValue);
    }
    if (refreshValueOnEditEnd) {
      setLocalValue(value ?? "");
    }
  };

  const startEdit = (e: any) => {
    e.stopPropagation();
    setEditing(true);
    if (onStartEdit) {
      onStartEdit();
    }
  }

  if (!editing) {
    if (!value) {
      return (
        <p
          className={`${className ?? ''} ${placeholderClassName ?? ''} ${(placeholderClassName || className) ? '' : styles.placeholder
            }`}
          onClick={startEdit}
        >
          {placeholder}
        </p>
      );
    }
    return (
      <p
        className={`${className ?? ''} ${textClassName ?? ''} ${(textClassName || className) ? '' : styles.textContainer
          }`}
        onClick={startEdit}
      >
        {localValue}
      </p>
    );
  }

  return (
    <>
      <input
        ref={ref}
        className={`${className ?? ""} ${inputClassName ?? ""}`}
        autoFocus={true}
        onBlur={onBlur}
        type={inputType ?? "text"}
        value={localValue}
        onChange={e => {
          setLocalValue(e.target.value);
        }}
      />
      {!hideIconWhenEditing && <FiEdit2 size="16" color="#b395e0" />}
    </>
  );
};

export default EditableText;
