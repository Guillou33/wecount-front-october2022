import AuthLayout from "@components/layout/AuthLayout";
import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/campaign/campaignList.module.scss";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { create } from "@actions/campaign/campaignActions";
import Campaigns from "@components/userSettings/resource-crud/campaign/Campaigns";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { RouteCampaignGenerator } from "@custom-types/core/routes";
import useSetOnceAllCampaignInfo from "@hooks/core/reduxSetOnce/useSetOnceAllCampaignInfo";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { YearPicker } from "@components/helpers/ui/selects";
import InputAddon from "@components/helpers/form/field/InputAddon";
import SiteProductLayout from "../common/SiteProductLayout";
import NewCampaignModal from "./sub/NewCampaignModal";
import { upperFirst } from "lodash";
import { t } from "i18next";

const CampaignList = () => {
    useSetOnceAllCampaignInfo(true);
    const withReadOnlyAccessControl = useReadOnlyAccessControl();

    const [modaleOpen, setModaleOpen] = useState(false);

    return (
        <SiteProductLayout>
            <div style={{ marginTop: 25 }}>
                <ButtonSpinner
                    spinnerOn={false}
                    onClick={withReadOnlyAccessControl(() => setModaleOpen(true))}
                    className={cx("button-1 float-right mb-4")}
                >
                    + {upperFirst(t("global.add"))}
                </ButtonSpinner>
                <div className={cx("clearfix")}></div>
                <Campaigns />
            </div>
            <NewCampaignModal
              open={modaleOpen}
              onClose={() => {
                  setModaleOpen(false);
              }}
            />
        </SiteProductLayout>
    );
}

export default CampaignList;
