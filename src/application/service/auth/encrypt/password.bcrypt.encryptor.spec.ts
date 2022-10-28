import { PasswordBcryptEncryptor } from "./password.bcrypt.encryptor";

describe('bcrypt 비밀번호 암호화 테스트', () => {
    const sut = new PasswordBcryptEncryptor();
    const givenRawPassword = "copang";

    test('원본 비밀번호를 해시 함수로 암호화하면 원본 비밀번호와 다른, 해싱된 비밀번호가 리턴된다.', async () => {
        const actualHashedPassword = await sut.encrypt(givenRawPassword);

        expect(actualHashedPassword).not.toEqual(givenRawPassword);
    });

    test('해시 함수로 암호화 한 비밀번호를 원본 비밀번호와 비교하면 검증에 성공한다.', async () => {
        const givenHashedPassword = await sut.encrypt(givenRawPassword);

        const actualResult = await sut.compare(givenRawPassword, givenHashedPassword);

        expect(actualResult).toBeTruthy();
    });

    test('해시 함수로 암호화 한 비밀번호를 원본 비밀번호가 아닌 다른 비밀번호와 비교하면 검증에 실패한다.', async () => {
        const givenHashedPassword = await sut.encrypt(givenRawPassword);
        const givenWrongPassword = "copa";

        const actualResult = await sut.compare(givenWrongPassword, givenHashedPassword);

        expect(actualResult).toBeFalsy();
    });
});
