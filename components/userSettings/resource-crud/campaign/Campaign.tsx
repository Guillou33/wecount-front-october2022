import React, { useMemo, useState } from 'react';
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { CampaignInformation } from "@reducers/campaignReducer";
import styles from "@styles/userSettings/resource-crud/campaign/campaign.module.scss";
import {
  getTotalUncertainty,
  getTotalResultTco2,
} from "@lib/core/campaign/getTotals";
import { RouteCampaignGenerator } from "@custom-types/core/routes";
import { useRouter } from "next/router";
import useReadOnlyAccessControl from '@hooks/core/readOnlyMode/useReadOnlyAccessControl';
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { Option, SelectOne, YearPicker } from "@components/helpers/ui/selects";
import InputAddon from "@components/helpers/form/field/InputAddon";
import { ButtonSpinner } from '@components/helpers/form/button/Buttons';
import { updateCampaign } from '@actions/campaign/campaignActions';
import { CampaignType } from '@custom-types/core/CampaignType';
import CampaignStatusBadge from '@components/core/CampaignStatusBadge';
import { CampaignStatus } from '@custom-types/core/CampaignStatus';
import { getCampaignTypeName } from '@lib/core/campaign/getCampaignTypeName';
import { nextStatusAuthorization } from '@lib/core/campaign/nextStatusAuthorization';
import selectUnavailableYears from '@selectors/campaign/selectUnavailableYears';
import selectUnarchivedCampaignNumber from '@selectors/campaign/selectUnarchivedCampaignNumber';
import { remove, upperFirst } from 'lodash';
import { t } from 'i18next';
import { getTotalResultTco2ForTrajectory } from '@lib/core/campaign/getTotalsForTrajectory';
import { getEmissionNumbers, reformatConvertToTons } from '@lib/core/campaign/getEmissionNumbers';
import { formatNumberWithLanguage } from '@lib/translation/config/numbers';

interface Props {
  id: number;
  onArchiveClick: () => void;
}

const Campaign = ({ id, onArchiveClick }: Props) => {
  const [modaleOpened, setModaleOpened] = useState(false);
  const [yearErrorModalOpen, setYearErrorModalOpen] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();
  const campaignInformation = useSelector<RootState, CampaignInformation>(
    (state) => state.campaign.campaigns[id].information!
  );
  
  const [campaignType, setCampaignType] = useState<CampaignType>(campaignInformation.type);
  const [campaignName, setCampaignName] = useState<string>(campaignInformation.name);
  const [year, setYear] = useState<number | null>(campaignInformation.year);
  const [newStatus, setNewStatus] = useState<CampaignStatus | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const unarchivedCampaignNumber = useSelector(
    (state: RootState) => {
      return selectUnarchivedCampaignNumber(state);
    }
  );
  const unavailableYears = useSelector(
    (state: RootState) => {
      return selectUnavailableYears(state)[campaignType];
    }
  );
  const isYearUnavailable = (year: number, statusToUpdate?: CampaignStatus): boolean => {
    return unavailableYears?.indexOf(year) !== -1 
      && (
        year !== campaignInformation.year 
        || campaignType !== campaignInformation.type
        || (campaignInformation.status === CampaignStatus.ARCHIVED && !!statusToUpdate && statusToUpdate !== campaignInformation.status)
      )
    ; 
  }

  const resetForm = () => {
    setCampaignType(campaignInformation.type);
    setCampaignName(campaignInformation.name);
    setYear(campaignInformation.year);
    setNewStatus(undefined);
    setErrorMessage(undefined);
  }

  const resultTco2Total = getTotalResultTco2(campaignInformation);

  const resultTco2TotalForTrajectory = getTotalResultTco2ForTrajectory(campaignInformation);

  const onSubmit = () => {
    setErrorMessage(undefined);
    if (isYearUnavailable(year!, newStatus)) {
      setErrorMessage(upperFirst(t("campaign.typeAlreadyExists")));
      return;
    }
    dispatch(updateCampaign({
      campaignId: id,
      name: campaignName,
      year: year!,
      status: newStatus,
      type: campaignType,
    }));
    setModaleOpened(false);
  }

  const nextStatusesAuthorized = useMemo(() => {
    let statuses = [...nextStatusAuthorization[campaignInformation.status]];
    if (statuses.indexOf(CampaignStatus.ARCHIVED) !== -1 && unarchivedCampaignNumber <= 1) {
      remove(statuses, status => status === CampaignStatus.ARCHIVED);
    }
    return statuses;
  }, [campaignInformation.status, unarchivedCampaignNumber])

  const renderStatusSelector = ({
    selected,
    onChange,
  }: {
    selected: CampaignStatus,
    onChange: (status: CampaignStatus) => void;
  }) => (
    <SelectOne
      selected={selected}
      onOptionClick={updatedStatus => onChange(updatedStatus)}
    >
      {ctx => (
        <>
          {
            [campaignInformation.status, ...nextStatusesAuthorized].map(status => (
              <Option {...ctx} value={status} key={status}>
                <CampaignStatusBadge status={status} />
              </Option>
            ))
          }
        </>
      )}
    </SelectOne>
  )

  return (
    <>
      <tr className={cx(styles.mainTr)}>
        <td>
          {campaignInformation.name}
        </td>
        <td>
          {
            renderStatusSelector({
              selected: campaignInformation.status,
              onChange: updatedStatus => {
                if (updatedStatus === campaignInformation.status) {
                  return;
                }
                if (isYearUnavailable(campaignInformation.year, updatedStatus)) {
                  setYearErrorModalOpen(true);
                  return;
                }
                dispatch(updateCampaign({
                  campaignId: id,
                  name: campaignInformation.name,
                  year: campaignInformation.year,
                  status: updatedStatus,
                  type: campaignInformation.type,
                }));
              }
            })
          }
        </td>
        <td>
          {getCampaignTypeName(campaignInformation.type)}
        </td>
        <td>
          {campaignInformation.year ? `${campaignInformation.year}` : ""}
        </td>
        <td>
          <strong>{formatNumberWithLanguage(getEmissionNumbers(Math.round((resultTco2TotalForTrajectory * 100) / 1000) / 100))}</strong>{" "}
          {t("footprint.emission.tco2.tco2e")}
        </td>
        <td>
          <strong>{formatNumberWithLanguage(getEmissionNumbers(Math.round((resultTco2Total * 100) / 1000) / 100))}</strong>{" "}
         {t("footprint.emission.tco2.tco2e")}
        </td>
        <td>
          <i
            onClick={() =>
              router.push(
                RouteCampaignGenerator.path,
                RouteCampaignGenerator.generate(campaignInformation.id)
              )
            }
            className={cx("fas fa-eye", styles.iconAction, styles.iconSee)}
          ></i>
          <i
            className={cx(styles.iconAction, styles.iconUpdate, "fa fa-pen")}
            onClick={withReadOnlyAccessControl(() => setModaleOpened(true))}
          ></i>
          {
            unarchivedCampaignNumber > 1 && (
              <i
                className={cx(styles.iconAction, styles.iconUpdate, "fa fa-trash")}
                onClick={withReadOnlyAccessControl(onArchiveClick)}
              ></i>
            )
          }
        </td>
      </tr>
      <ClassicModal
        open={modaleOpened}
        onClose={() => {
          setModaleOpened(false);
          resetForm();
        }}
        small
      >
        <label className={cx(styles.modalLabel)}>{upperFirst(t("campaign.campaignName"))}</label>
        <InputAddon
          value={campaignName}
          onLocalChange={setCampaignName}
          inputClassName={styles.nameInput}
          placeholder={upperFirst(t("campaign.campaignName"))}
        />
        <label className={cx(styles.modalLabel)} style={{ marginTop: 10 }}>
          {upperFirst(t("campaign.campaignType"))}
        </label>
        <div className={cx()}>
          <SelectOne
            selected={campaignType}
            onOptionClick={newCampaignType => {
              setCampaignType(newCampaignType);
            }}
          >
            {ctx => (
              <>
                {[
                  CampaignType.CARBON_FOOTPRINT,
                  CampaignType.SIMULATION,
                  CampaignType.DRAFT,
                ].map(currentCampaignType => (
                  <Option
                    {...ctx}
                    value={currentCampaignType}
                    key={currentCampaignType}
                  >
                    {getCampaignTypeName(currentCampaignType)}
                  </Option>
                ))}
              </>
            )}
          </SelectOne>
        </div>
        <label className={cx(styles.modalLabel)} style={{ marginTop: 10 }}>{upperFirst(t("campaign.referenceYear"))}</label>
        <YearPicker
          selected={year}
          onOptionClick={setYear}
          placeholder={upperFirst(t("campaign.defineReferenceYear"))}
          disableYear={isYearUnavailable}
        />
        <label className={cx(styles.modalLabel)} style={{ marginTop: 10 }}>{upperFirst(t("status.status.singular"))}</label>
        <div className={cx()}>
          {
            renderStatusSelector({
              selected: newStatus ?? campaignInformation.status,
              onChange: updatedStatus => {
                if (updatedStatus === campaignInformation.status) {
                  setNewStatus(undefined);
                }
                setNewStatus(updatedStatus);
              }
            })
          }
        </div>
        {errorMessage && (
          <div className={cx(styles.errorMessage)}>
            <p><i className={cx('fas fa-exclamation-triangle')}></i> {errorMessage}</p>
          </div>
        )}
        <div className={cx(styles.buttonCreateContainer)}>
          <ButtonSpinner
            spinnerOn={false}
            disabled={year === null || campaignName == null || campaignName.length < 1}
            className={cx("button-1")}
            onClick={onSubmit}
          >
            {upperFirst(t("campaign.modifyCampaign"))}
          </ButtonSpinner>
        </div>
      </ClassicModal>
      <ClassicModal
        open={yearErrorModalOpen}
        onClose={() => {
          setYearErrorModalOpen(false);
        }}
        small
      >
        <div className={cx(styles.yearErrorModal)}>
          <p className={cx(styles.yearErrorModalText)}>
            {upperFirst(t("campaign.yearAlreadyExists"))} !
          </p>
          <ButtonSpinner
              spinnerOn={false}
              className={cx("button-2", styles.yearErrorModalBtn)}
              onClick={() => setYearErrorModalOpen(false)}
            >
            Ok
          </ButtonSpinner>
        </div>
      </ClassicModal>
    </>
  );
};

export default Campaign;
