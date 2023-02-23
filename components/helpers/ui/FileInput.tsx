import { useState, useRef } from "react";
import cx from "classnames";
import { t } from "i18next";
import { upperFirst } from "lodash";

import DangerConfirmModal from "../modal/DangerConfirmModal";

import styles from "@styles/helpers/ui/fileInput.module.scss";

type Timer = ReturnType<typeof setTimeout>;

interface Props {
  value: File | null;
  placeholder?: string;
  onChange?: (file: File) => void;
  accept?: string[];
  className?: string;
}

const FileInput = ({
  value,
  placeholder = upperFirst(t("fileInput.placeholder")),
  onChange = () => {},
  accept = [],
  className,
}: Props) => {
  const fileName = value?.name;
  const [isDragOver, setDragOver] = useState(false);
  const [hasBadExtension, setHasBadExtension] = useState(false);

  function isExtensionValid(file: File): boolean {
    const extension = file.name.split(".")[1];
    if (accept.length === 0) {
      return true;
    }
    return accept.includes(`.${extension}`);
  }

  function handleFileInput(file: File | null) {
    setHasBadExtension(false);
    if (file != null) {
      if (isExtensionValid(file)) {
        onChange(file);
      } else {
        setHasBadExtension(true);
      }
    }
  }

  const timer = useRef<Timer | null>(null);

  function batchDragOverUpdates(value: boolean) {
    if (timer.current != null) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setDragOver(value);
    }, 20);
  }

  return (
    <div
      className={cx(styles.fileInput, className, {
        [styles.draggedOver]: isDragOver,
      })}
      onDragOver={e => {
        e.preventDefault();
        batchDragOverUpdates(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        batchDragOverUpdates(false);
      }}
      onDrop={e => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0] ?? null;
        handleFileInput(file);
        setDragOver(false);
      }}
    >
      <label className={styles.triggerFileChooser}>
        <input
          type="file"
          className={styles.htmlInput}
          accept={accept.join(", ")}
          onChange={e => {
            const file = e.target.files?.[0] ?? null;
            handleFileInput(file);
          }}
        />
        <span
          className={cx(styles.fileName, {
            [styles.hasPlaceholder]: fileName == null,
          })}
        >
          <span>{fileName ?? placeholder}</span>
          {accept.length > 0 && (
            <span className="font-italic">({accept.join(", ")})</span>
          )}
        </span>
        <i className={cx(styles.uploadIcon, "fas fa-upload")} />
      </label>
      <DangerConfirmModal
        open={hasBadExtension}
        small
        onClose={() => setHasBadExtension(false)}
        btnText="ok"
        btnDanger={false}
        onConfirm={() => setHasBadExtension(false)}
        question={
          <div className={styles.extensionMessage}>
            <p className={styles.title}>Opération impossible</p>
            <p>
              Le type du fchier choisi n'est pas correct. Veuillez utiliser un
              fichier avec
              {accept.length === 1 ? ` le type ` : ` un de ces types : `}
              <span className="font-italic">{accept.join(", ou ")}</span>
            </p>
          </div>
        }
      />
    </div>
  );
};

export default FileInput;
