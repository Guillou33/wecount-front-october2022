import { removeCreationError, requestCreation, setSearchedSitesInSiteCreationModalInSettings } from "@actions/core/site/siteActions";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import Checkbox from "@components/helpers/ui/CheckboxInput";
import { useMounted } from "@hooks/utils/useMounted";
import { RootState } from "@reducers/index";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { SiteList } from "@reducers/core/siteReducer";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import _ from "lodash";
import useAllSiteList from "@hooks/core/useAllSiteList";
import SearchInput from "@components/helpers/form/field/SearchInput";
import useSearchedSitesInSiteCreationModalInSettings from "@hooks/core/useSearchedSitesInSiteCreationModalInSettings";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateSiteModal = ({
  open,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  const sites = useSearchedSitesInSiteCreationModalInSettings();

  const allSitesFetched = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  )

  const mounted = useMounted();

  const isCreating = useSelector<RootState, boolean>(state => state.core.site.isCreating);
  const creationError = useSelector<RootState, boolean>(state => state.core.site.creationError);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isInSite, setIsInSite] = useState(false);

  const [parentSiteId, setParentSiteId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      if(!_.isEmpty(sites)){
        setParentSiteId(Object.values(sites)[0].id);
      }
      if(!_.isEmpty(sites)){
        setParentSiteId(Object.values(sites)[0].id);
      }
      dispatch(removeCreationError());
    }
  }, [open, sites]);
  
  useEffect(() => {
    if (mounted && !isCreating && !creationError) {
      onClose();
    }
  }, [mounted, isCreating, creationError]);

  return (
    <ClassicModal
      open={open}
      onClose={onClose}
      small
    >
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={name}
          placeholder={upperFirst(t("global.common.name"))}
          onHtmlChange={(value: string) => {
            setName(value);
            dispatch(removeCreationError());
          }}
          onLocalChange={(value: string) => {
            if (!name) {
              setName(value);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.description"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          className={cx("field")}
          value={description}
          placeholder={upperFirst(t("global.common.description"))}
          onHtmlChange={(value: string) => {
            dispatch(removeCreationError());
            setDescription(value);
          }}
        />
      </div>
      {parentSiteId !== 0 && (
        <div>
          <Checkbox
            className={cx(styles.chkCreateSite)}
            checked={isInSite}
            disabled={_.isEmpty(_.filter(allSitesFetched, (site) => site.archivedDate === null))}
            onChange={() => {
              setIsInSite(!isInSite)
            }}
            id="is-in-site"
          >
            {upperFirst(t("site.isSubSite"))} ?
          </Checkbox>
          <SelectOne
            disabled={!isInSite}
            className={cx([styles.languageSelector])}
            selected={parentSiteId}
            onOptionClick={(siteId) => {
              setParentSiteId(siteId)
            }}
          >
            {(ctx) => (
              <>
                <SearchInput
                  className={cx(styles.parentSiteSearch)}
                  placeholder={`${upperFirst(t("site.search"))}...`}
                  value={searchTerm}
                  onChange={e => {
                      const name = e.target.value;
                      setSearchTerm(name);
                      if (name !== "") {
                          dispatch(setSearchedSitesInSiteCreationModalInSettings({searchedTerms: name}));
                      }
                      if(name === ""){
                          dispatch(setSearchedSitesInSiteCreationModalInSettings({searchedTerms: ""}));
                      }
                  }}
                />
                {Object.values(sites).filter(site => !site.archivedDate).map(
                  (option) => (
                    <Option
                      {...ctx}
                      value={option.id}
                      key={option.id}
                    >
                      {option.name}
                    </Option>
                  )
                )}
              </>
            )}
          </SelectOne>
        </div>
      )}
      {
        creationError && (
          <p className={cx("text-danger")}>{upperFirst(t("error.genericError2"))}...</p>
        )
      }
      <div className={cx(styles.buttonCreateContainer)}>
        <ButtonSpinner
          spinnerOn={isCreating}
          disabled={!name}
          className={cx("button-1")}
          onClick={() => {
            if (currentPerimeter != null) {
              dispatch(
                requestCreation({
                  perimeterId: currentPerimeter.id,
                  name,
                  description,
                  parentSiteId: isInSite ? parentSiteId : null
                })
              );
            }
          }}
        >
          {upperFirst(t("site.create"))}
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default CreateSiteModal;
