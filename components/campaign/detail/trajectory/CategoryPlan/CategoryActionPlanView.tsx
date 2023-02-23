import { useDispatch } from "react-redux";
import { useState } from "react";
import cx from "classnames";
import styles from "@styles/campaign/detail/trajectory/actionPlan.module.scss";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import FakeInput from "@components/campaign/detail/trajectory/helpers/FakeInput";
import {
  requestSaveActionPlan,
  requestDeleteActionPlan,
} from "@actions/trajectory/campaigntrajectories/campaignTrajectoriesAction";
import { ActionPlan } from "@reducers/trajectory/campaignTrajectories/campaignTrajectoriesReducer";
import InputAddon from "@components/helpers/form/field/InputAddon";
import Dropdown from "@components/helpers/ui/dropdown/Dropdown";
import { PossibleAction } from "@lib/wecount-api/responses/apiResponses";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { Scope } from "@custom-types/wecount-api/activity";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import useReadOnlyModeDelayer from "@hooks/core/readOnlyMode/useReadOnlyModeDelayer";
import { impactItems } from "@custom-types/core/ImpactItems";
import { ReductionField } from "../helpers/ReductionFields";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { upperFirst } from "lodash";
import { t } from "i18next";

// use to set old reduction value choosed by user before trajectory redesign
const verifyReduction = (
  comments: string | null,
  reduction: number | null
): string | null => {
  let newComments = null;
  let reductionToVerify =
    reduction && reduction > 0 ? `+${reduction}` : reduction;
  if (comments) {
    newComments =
      reductionToVerify &&
      !impactItems.includes(reductionToVerify.toString()) &&
      !comments.includes(
        `${upperFirst(
          t("trajectory.projection.actionPlan.comment.old")
        )} : ${reductionToVerify}%. `
      )
        ? `${upperFirst(
            t("trajectory.projection.actionPlan.comment.old")
          )} : ${reductionToVerify}%. ${comments}`
        : comments;
  } else {
    newComments =
      reductionToVerify && !impactItems.includes(reductionToVerify.toString())
        ? `${upperFirst(
            t("trajectory.projection.actionPlan.comment.old")
          )} : ${reductionToVerify}%. `
        : "";
  }
  return newComments;
};

type PartialActionPlan = Partial<Omit<ActionPlan, "id">>;

type EditionModalState = "closed" | "description" | "comments";

const editionModaleTexts: {
  [state in EditionModalState]: string;
} = {
  closed: "",
  description: upperFirst(t("trajectory.projection.actionPlan.action.action")),
  comments: upperFirst(
    t("trajectory.projection.actionPlan.action.description")
  ),
};

interface Props {
  trajectoryId: number;
  categoryId: number;
  computedReduction: number;
  computedTco2: number;
  possibleActions: PossibleAction[];
  actionPlanData: ActionPlan;
  scope: Scope;
}

const CategoryActionPlanView = ({
  trajectoryId,
  categoryId,
  computedReduction,
  computedTco2,
  possibleActions,
  actionPlanData,
  scope,
}: Props) => {
  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);

  // give time to show the readonly feedback popup after updating a protected field.
  // if not used, since a blur event fires just before a click event, the popup shows on blur, then the click fires and close the popup instantly
  const delayedInReadOnlyMode = useReadOnlyModeDelayer(100);

  const [editionModal, setEditionModal] = useState<EditionModalState>("closed");

  const { actionId, description, comments, reduction } = actionPlanData;

  // get old value before new choice field of reduction
  const oldReduction = reduction;

  function updateActionPlan(actionPlanUpdatedData: PartialActionPlan): void {
    const actionPlan: ActionPlan = {
      ...actionPlanData,
      ...actionPlanUpdatedData,
    };
    if (isManager) {
      dispatch(
        requestSaveActionPlan(trajectoryId, categoryId, null, actionPlan)
      );
    }
  }

  function updateComments(comments: string | null): void {
    const actionPlan = { ...actionPlanData, comments };
    if (isManager) {
      dispatch(
        requestSaveActionPlan(trajectoryId, categoryId, null, actionPlan)
      );
    }
  }

  function updateDescription(description: string | null): void {
    const actionPlan = { ...actionPlanData, description };

    if (isManager) {
      dispatch(
        requestSaveActionPlan(trajectoryId, categoryId, null, actionPlan)
      );
    }
  }

  function modaleUpdate(value: string | null) {
    if (editionModal === "comments") {
      return updateComments(value);
    }
    if (editionModal === "description") {
      return updateDescription(value);
    }
  }

  function deleteActionPlan() {
    if (isManager) {
      dispatch(
        requestDeleteActionPlan(trajectoryId, categoryId, null, actionPlanData)
      );
    }
  }

  return (
    <div className={styles.actionPlan}>
      <div className={cx(styles.dropdownOptions)}>
        <Dropdown
          togglerContent={
            <i className={cx("fa fa-ellipsis-v", styles.moreAction)}></i>
          }
        >
          <Dropdown.Item
            onClick={() => {
              withReadOnlyAccessControl(deleteActionPlan)();
            }}
          >
            <span className={styles.actionEntry}>
              <i className={cx("fa fa-trash")}></i>{" "}
              {upperFirst(t("global.delete"))}
            </span>
          </Dropdown.Item>
        </Dropdown>
      </div>
      <SelectOne
        selected={actionId}
        onOptionClick={withReadOnlyAccessControl((actionId: number) =>
          updateActionPlan({ actionId })
        )}
        placeholder={upperFirst(t("global.choose"))}
      >
        {ctx => (
          <>
            {possibleActions.map(({ id, name }) => (
              <Option {...ctx} value={id} key={id}>
                {name}
              </Option>
            ))}
          </>
        )}
      </SelectOne>
      <div className={cx("default-field mb-0")}>
        <SelfControlledTextarea
          className={cx(styles.commentsInput)}
          value={verifyReduction(comments, reduction)}
          placeholder={`+ ${upperFirst(
            t("trajectory.projection.actionPlan.comment.add")
          )}`}
          onHtmlChange={value => updateComments(value)}
          rows={5}
        />
      </div>
      <SelectOne
        selected={reduction}
        className={cx(styles.actionPlanInput, styles.reductionInput)}
        onOptionClick={delayedInReadOnlyMode(
          withReadOnlyAccessControl((reduction: number) => {
            const parsedReduction = reduction;
            updateActionPlan({
              comments: verifyReduction(comments, oldReduction),
              reduction: !isNaN(parsedReduction) ? parsedReduction : null,
            });
          })
        )}
        placeholder="0 %"
      >
        {ctx => (
          <>
            {impactItems.map(item => {
              const value = parseFloat(item);
              return (
                <Option {...ctx} value={value} key={value}>
                  {item}
                </Option>
              );
            })}
          </>
        )}
      </SelectOne>
      <div className={styles.wrapper}>
        <ReductionField
          value={computedReduction}
          alternativeValue={computedTco2}
          type="light"
          className={styles.reductionBadge}
          scope={scope}
        />
      </div>
      <ClassicModal
        open={editionModal != "closed"}
        onClose={() => setEditionModal("closed")}
        small
      >
        {editionModal != "closed" && (
          <>
            <p className={cx(styles.modalLabel)}>
              {editionModaleTexts[editionModal]}
            </p>
            <div className={cx("default-field")}>
              <SelfControlledTextarea
                className={cx("field")}
                value={actionPlanData[editionModal]}
                placeholder={editionModaleTexts[editionModal]}
                onHtmlChange={value => modaleUpdate(value)}
                rows={5}
              />
            </div>
            <button
              className={cx("button-1", styles.editionModalEnd)}
              onClick={() => setEditionModal("closed")}
            >
              Ok
            </button>
          </>
        )}
      </ClassicModal>
    </div>
  );
};

export default CategoryActionPlanView;
