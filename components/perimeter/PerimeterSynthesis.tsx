import React, { useEffect } from "react";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";

import selectFilteredCampaignsForSynthesis from "@selectors/perimeters/selectFilteredCampaignsForSynthesis";

import { useSetOnceShownActivityModelsInSynthesis } from "@hooks/core/reduxSetOnce/useSetOnceShownActivityModelsInSynthesis";

import { selectCampaignsForSynthesis, selectCampaignStatusForSynthesis, selectCampaignsYearsForSynthesis } from "@actions/perimeter/perimeterActions";
import { PerimetersByEmission, ShowActivityModelsInTable } from "@reducers/perimeter/perimeterReducer";

import MultiSelectsForSynthesis from "./synthesis/MultiSelectsForSynthesis";
import SynthesisTable from "./synthesis/SynthesisTable";

import { upperFirst } from "lodash";
import { t } from "i18next";

const PerimeterSynthesis = () => {
    const contentRef = React.useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();
    const nonFilteredPerimeters = useSelector<RootState, PerimetersByEmission>(
        state => state.perimeter.emissions
    );
    const perimeters = useSelector<RootState, PerimetersByEmission>((state: RootState) => 
        selectFilteredCampaignsForSynthesis(state)
    );
    const showActivityModels = useSelector<RootState, ShowActivityModelsInTable>(
        state => state.perimeter.synthesis.table.shownActivityModels
    );
    useSetOnceShownActivityModelsInSynthesis(showActivityModels);

    return (
        <div className="page-content-wrapper">
            <div className={cx(styles.topBar)} ref={contentRef}>
                <div className={cx("alert", styles.introMessage)}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <div className={cx(styles.helpInfo)}>
                            <i className="fa fa-question"></i>
                        </div>
                        <p style={{ marginBottom: 0 }}>
                            {upperFirst(t("perimeter.synthesis.info"))}
                        </p>
                    </div>
                </div>
                <MultiSelectsForSynthesis 
                    onSelectCampaigns={(selection) => dispatch(selectCampaignsForSynthesis(selection))}
                    onSelectCampaignStatus={(selection) => dispatch(selectCampaignStatusForSynthesis(selection))}
                    onSelectCampaignsYears={(selection) => dispatch(selectCampaignsYearsForSynthesis(selection))}
                />
            </div>
            <div className={"page-content"}>
                <SynthesisTable 
                    perimeters={perimeters}
                    nonFilteredPerimeters={nonFilteredPerimeters}
                />
            </div>
        </div>
    );
}

export default PerimeterSynthesis;