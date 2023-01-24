import { CoPangException } from './exception';

describe('CoPangException 테스트 ', () => {
  test('메시지만 넘기는 경우 메시지가 그대로 CoPangException 메시지로 설정된다', async () => {
    // given
    const givenMessage = '해당 유저을(를) 찾을 수 없습니다.';
    const expectedMessage = '해당 유저을(를) 찾을 수 없습니다.';

    // when
    const actualMessage = new CoPangException(givenMessage).getMessage();

    // then
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('메시지에 파라미터 하나를 심고, 가변인자 하나와 함께 넘기면 가변인자가 적용된 메시지가 응답된다', async () => {
    // given
    const givenMessage = '해당 {0}을(를) 찾을 수 없습니다.';
    const givenVarArg = '상품';
    const expectedMessage = '해당 상품을(를) 찾을 수 없습니다.';

    // when
    const actualMessage = new CoPangException(givenMessage, givenVarArg).getMessage();

    // then
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('메시지에 파라미터 세 개를 심고, 가변인자 세 개와 함께 넘기면 가변인자가 적용된 메시지가 응답된다', async () => {
    // given
    const givenMessage = '해당 {0}을(를) {1} {2} 찾을 수 없습니다.';
    const givenVarArg1 = '상품';
    const givenVarArg2 = '정말';
    const givenVarArg3 = '불행히도';
    const expectedMessage = '해당 상품을(를) 정말 불행히도 찾을 수 없습니다.';

    // when
    const actualMessage = new CoPangException(givenMessage, givenVarArg1, givenVarArg2, givenVarArg3).getMessage();

    // then
    expect(actualMessage).toEqual(expectedMessage);
  });

  test('메시지에 파라미터 세 개를 심고, 가변인자 두 개만 넘기면 마지막 파라미터는 적용되지 않은 메시지가 응답된다', async () => {
    // given
    const givenMessage = '해당 {0}을(를) {1} {2} 찾을 수 없습니다.';
    const givenVarArg1 = '상품';
    const givenVarArg2 = '정말';
    const expectedMessage = '해당 상품을(를) 정말 {2} 찾을 수 없습니다.';

    // when
    const actualMessage = new CoPangException(givenMessage, givenVarArg1, givenVarArg2).getMessage();

    // then
    expect(actualMessage).toEqual(expectedMessage);
  });
});
