import Head from 'next/head'
import requireAuth from '@components/hoc/auth/requireAuth';
import CampaignList from "@components/userSettings/resource-crud/campaign/CampaignsList";
import { PerimeterRole } from '@custom-types/wecount-api/auth';
import RequirePerimeterRole from '@components/auth/access-control/RequirePerimeterRole';
import { t } from 'i18next';
import { upperFirst } from 'lodash';

const CampaignsSettingsPage = () => {
    return (
        <>
            <Head>
                <title>{upperFirst(t("settings.settings"))} - {upperFirst(t("campaign.campaignManagement"))}</title>
            </Head>
            <RequirePerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
                <CampaignList />
            </RequirePerimeterRole>
        </>
    );
};

export default requireAuth(CampaignsSettingsPage);