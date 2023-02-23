import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";

import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

import PageStatus from "@components/core/PageStatus";

interface Props {
  url: string;
}

const CampaignBradcrums = ({
  url
}: Props) => {
  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );
  const companyName = useSelector<RootState, string | undefined>(
    state => state.profile.company?.name
  );
  const perimeterNumber = useSelector<RootState, number>(
    state => Object.keys(state.perimeter.perimeters).length
  );
  const currentPerimeter = useCurrentPerimeter();

  let pages = [
    {
      url: `/campaigns/${campaignId}`,
      name: companyName ?? "",
    },
  ];

  if (perimeterNumber > 1) {
    pages.push({
      url: `/campaigns/${campaignId}`,
      name: currentPerimeter?.name ?? "",
    });
  }

  return <PageStatus pages={pages} />;
};

export default CampaignBradcrums;
