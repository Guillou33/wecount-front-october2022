import siteSagas from './siteSagas';
import productSagas from './productSagas';
import userSagas from './userSagas';
import emissionFactorSagas from "./emissionFactorSagas";
import entryTagSagas from "./entryTagSagas";
import customEmissionFactorSagas from "./customEmissionFactorSagas";

export default [
  ...siteSagas,
  ...productSagas,
  ...userSagas,
  ...emissionFactorSagas,
  ...entryTagSagas,
  ...customEmissionFactorSagas,
];
