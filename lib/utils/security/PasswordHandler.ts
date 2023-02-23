import { t } from 'i18next';
import { upperFirst } from 'lodash';
import passwordValidator from 'password-validator';

export const passwordHandlerMalformedErrorMessage = upperFirst(t("user.account.validation.passwordHandler"));
export default class PasswordHandler {
  static securityLevelAccepted(password: string): boolean {
    const pwdSchema = new passwordValidator();
    pwdSchema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().digits(1)
      .has().not().spaces()
      .has().symbols(1);

    return pwdSchema.validate(password) as boolean;
  }
}
