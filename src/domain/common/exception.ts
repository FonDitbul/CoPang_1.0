export const EXCEPTION_STATUS = {
  USER_ID_DUPLICATE: '해당 user Id는 이미 존재합니다.',
  USER_NOT_EXIST: '해당 유저가 존재하지 않습니다.',
  USER_DELETED: '해당 유저는 삭제되었습니다.',
  USER_PASSWORD_NOT_MATCH: '유저의 비밀번호가 일치하지 않습니다.',

  PAGING_NUM_ERROR: '페이징 넘버 에러',
  PAGING_SORT_BY_OPTION_ERROR: '존재하지 않는 정렬 옵션',
  PAGING_ORDER_OPTION_ERROR: 'asc or desc 가 아닙니다',

  ENTITY_INSERT_ERROR: '{0}을(를) 저장하는 데에 실패했습니다.',
};

export class CoPangException extends Error {
  message: string;
  constructor(message: string, ...args: any[]) {
    super();
    let resultMessage = message;
    args.forEach((val, index) => {
      const findWord = `{${index}}`; // {0}, {1}, {2} ...
      resultMessage = resultMessage.replace(findWord, val);
    });
    this.message = resultMessage;
  }

  getMessage() {
    return this.message;
  }
}
