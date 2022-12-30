export const EXCEPTION_STATUS = {
  USER_ID_DUPLICATE: '해당 user Id는 이미 존재합니다.',
  USER_NOT_EXIST: '해당 유저가 존재하지 않습니다.',
  USER_DELETED: '해당 유저는 삭제되었습니다.',
  USER_PASSWORD_NOT_MATCH: '유저의 비밀번호가 일치하지 않습니다.',
};

export class CoPangException extends Error {
  private static message: string;
  getMessage() {
    return this.message;
  }
}
