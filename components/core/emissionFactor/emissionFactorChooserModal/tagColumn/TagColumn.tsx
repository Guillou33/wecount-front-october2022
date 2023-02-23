import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import { useDispatch } from "react-redux";
import { setTagColumnOpen } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import TagFilterGroups from "./TagFilterGroup";

const TagColumn = () => {
  const dispatch = useDispatch();

  return (
    <div className={cx(styles.tagColumn)}>
      <div className={cx(styles.header)}>
        <button
          onClick={() => dispatch(setTagColumnOpen(false))}
          className={cx(styles.closeButton)}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>
      <TagFilterGroups />
    </div>
  );
};

export default TagColumn;
