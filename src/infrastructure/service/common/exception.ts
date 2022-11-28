import { ERROR_STATUS } from '../../../domain/common/const';
const badRequestArray = ['userIdDuplicate', 'userPasswordNotMatch'];
const forbiddenArray = ['userNotExist', 'userDelete'];

export const badRequestError = Object.keys(ERROR_STATUS)
  .filter((e) => badRequestArray.includes(e))
  .map((v) => ERROR_STATUS[v]);

export const forbiddenError = Object.keys(ERROR_STATUS)
  .filter((e) => forbiddenArray.includes(e))
  .map((v) => ERROR_STATUS[v]);
