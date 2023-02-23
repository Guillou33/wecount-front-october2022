import styles from "@styles/perimeter/perimeterHome.module.scss";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import { useState } from "react";
import { RootState } from "@reducers/index";

import { PerimetersByEmission, PerimetersById } from "@reducers/perimeter/perimeterReducer";
import { requestCurrentPerimeterSwitch, requestPerimeterDeletion } from "@actions/perimeter/perimeterActions";

import { CampaignStatus } from "@custom-types/core/CampaignStatus";

import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

import PerimeterCard from "./sub/PerimeterCard";
import CreatePerimeterModal from "./sub/CreatePerimeterModal";
import EditPerimeterModal from "./sub/EditPerimeterModal";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import { countCampaignStatutes } from "./helpers/countCampaignStatutes";

import { upperFirst } from "lodash";
import { t } from "i18next";

const PerimeterMonitoring = () => {
    const dispatch = useDispatch();
    const currentPerimeter = useCurrentPerimeter();
    
    const perimeters = useSelector<RootState, PerimetersByEmission>(
      state => state.perimeter.emissions
    );

    const [isCreationModaleOpened, setCreationModaleOpened] = useState(false);
    const [editedPerimeterId, setEditedPerimeterId] = useState<number | null>(
      null
    );
    const [perimeterIdToDelete, setPerimeterIdToDelete] = useState<number | null>(
      null
    );
  
    const perimeterList = Object.values(perimeters);
    
    return (
        <>
        <div className="page-content-wrapper">
          <div className={"page-content"}>
            <div className={styles.content}>
              {perimeterList.map(perimeter => {
                const nbrCampaignInStatuses = {
                  [CampaignStatus.ARCHIVED]: countCampaignStatutes(perimeter.campaigns, CampaignStatus.ARCHIVED),
                  [CampaignStatus.CLOSED]: countCampaignStatutes(perimeter.campaigns, CampaignStatus.CLOSED),
                  [CampaignStatus.IN_PREPARATION]: countCampaignStatutes(perimeter.campaigns, CampaignStatus.IN_PREPARATION),
                  [CampaignStatus.IN_PROGRESS]: countCampaignStatutes(perimeter.campaigns, CampaignStatus.IN_PROGRESS),
                }
                return (
                  <PerimeterCard
                    key={perimeter.id}
                    id={perimeter.id}
                    name={perimeter.name}
                    description={perimeter.description}
                    nbrCampaignInStatuses={nbrCampaignInStatuses}
                    onEditClick={setEditedPerimeterId}
                    onArchiveClick={setPerimeterIdToDelete}
                    isLastPerimeter={perimeterList.length === 1}
                  />
                );
              }
              )}
              <button
                className="button-2"
                onClick={() => setCreationModaleOpened(true)}
              >
                + {upperFirst(t("global.add"))}
              </button>
            </div>
          </div>
        </div>
        <CreatePerimeterModal
          open={isCreationModaleOpened}
          onClose={() =>
            setCreationModaleOpened(false)
          }
        />
        <EditPerimeterModal
          perimeterId={editedPerimeterId}
          onClose={() => setEditedPerimeterId(null)}
        />
        <DangerConfirmModal
          small
          open={perimeterIdToDelete != null}
          question={
            <div className="color-1 text-center">
              <p>
                <strong>{upperFirst(t("perimeter.questionDelete"))} ?</strong>
              </p>
              <p>
                {upperFirst(t("perimeter.warningDelete"))}.
              </p>
            </div>
          }
          btnText={upperFirst(t("global.delete"))}
          onConfirm={() => {
            if (perimeterIdToDelete != null) {
              dispatch(requestPerimeterDeletion(perimeterIdToDelete));

              if (perimeterIdToDelete === currentPerimeter?.id) {
                const switchToPerimeter = perimeterList.find(
                  perimeter => perimeter.id !== perimeterIdToDelete
                );
                if (switchToPerimeter != null) {
                  dispatch(requestCurrentPerimeterSwitch(switchToPerimeter.id));
                }
              }
            }
            setPerimeterIdToDelete(null);
          }}
          onClose={() => setPerimeterIdToDelete(null)}
        />
      </>
    );
}

export default PerimeterMonitoring;