# CoPang

## Description
    
* 이커머스 토이 프로젝트
* 프로젝트 목표
    * 클린 아키텍처 스터디 
        * 프로젝트 구조  
        * 모듈 구조 
    * Test 코드 도입 및 스터디
        * 아키텍처와 테스트
        * 유닛 테스트

### Structure
```                             
├─src                            
│  ├─application                 
│  │  └─service                  
│  │      ├─auth                            
│  │      ├─product              
│  │      └─seller
│  ├─domain
│  │  ├─common
│  │  └─service
│  │      ├─auth
│  │      ├─product
│  │      └─seller
│  └─infrastructure
│      ├─prisma
│      └─service
│          ├─auth
│          ├─common
│          ├─product
│          └─seller
```

# application 

- 실제 비즈니스 로직 구현 레이어
    - 비즈니스 로직 구현 
    - domain에 존재하는 service interface 를 가져온 구현체
    - 비즈니스 로직은 외부 의존성에 영향을 받으면 안된다. 

# domain
- 핵심 인터페이스
- 핵심 도메인 인터페이스 (Entity) 혹은 클래스
- 어떠한 의존성도 갖지 않는 독립적인 계층 

# infrastructure
- controller, repository 등 실제 구현체
- 해당 구현체
    - prisma, HTTP 통신, Database 등
    - 외부에서 제공하는 인터페이스, 라이브러리에 맞게 구현한 구현체


![Untitled](https://user-images.githubusercontent.com/49264688/218756289-f629761f-83a5-4c01-a06b-fe6e1f57413e.png)


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## lint

```bash
# 린트 체크
$ npm run lint

# 린트 적용 
$ npm run lint:fix
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
