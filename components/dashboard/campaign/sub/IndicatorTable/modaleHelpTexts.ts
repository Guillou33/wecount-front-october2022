import { t } from "i18next";
import { upperFirst } from "lodash";

const name = `${upperFirst(t("indicator.helpModales.name"))}.`;

const nameExample = `${upperFirst(t("indicator.helpModales.nameExample.part1"))} : ${upperFirst(t("indicator.helpModales.nameExample.part2"))}.`;

const unit = `${upperFirst(t("indicator.helpModales.unit.part1"))}. ${upperFirst(t("indicator.helpModales.unit.part2"))}.`;

const unitExample = `${upperFirst(t("indicator.helpModales.unitExample"))}`;

const quantity = `${upperFirst(t("indicator.helpModales.quantity"))}.`;

const quantityExample = `${upperFirst(t("indicator.helpModales.quantityExample"))}`;

const info = `${upperFirst(t("indicator.helpModales.info"))}.`;

const infoExample = `${upperFirst(t("indicator.helpModales.infoExample"))}.`;

export default {
  name,
  unit,
  quantity,
  info,
  nameExample,
  unitExample,
  quantityExample,
  infoExample,
};
