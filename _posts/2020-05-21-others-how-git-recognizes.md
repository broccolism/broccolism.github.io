---  
layout: post  
title: "[GitHub] 깃은 어떻게 파일 변화를 감지하나요?"
categories: others
tags: others project github file
comments: true
---

💥 안드로이드 팀 프로젝트를 진행하면서 아주 큰 일이 날 뻔했다. 정확히는 내가 모든 파일을 날려먹을 뻔했다. 정말 다행히도 완성본을 push하고, 모든 파일을 지우고 다시 push해서 완성본을 날리는 그 사이에 다른 팀원이 완성본을 pull 해둔 덕분에 파일은 잘 살아남았다.

❔ 우리 팀에는 개인 브랜치 총 6개와 기능별 브랜치 2개가 있었다. 그러니까 기능별 브랜치 중 하나에서 개인 브랜치 작업물 3개를 모두 merge한 뒤 각자 pull을 할 차례였다. 그런데 이렇게 하면 또 개인별 브랜치에서 conflict가 생길게 뻔하니 원래 있던 모든 파일을 지우고 기능 브랜치에서 pull하면 되지 않을까!? 하는 생각에 저런 과감한 짓을 했던 것이다.

👀 결과는 아주 처참했다. 개인 브랜치에서 아무리 pull을 해도 들어오는 파일이 없었다. 그저 반투명한 `.git`만 보일 뿐... 분명 기능 브랜치에는 안드로이드 앱을 위한 수많은 파일과 이미지 폴더 등이 있는데 말이다. 한 5분쯤 뒤에 알았지만 그 파일들 마저 완성본이 아니었다. 이상하다. 왜 안 받아오지? 라는 궁금증에서 시작해 이 글을 쓰기로 했다.

👩‍💻 출처: [GitHub Book](https://book.git-scm.com/book/en/v2/Git-Internals-Git-Objects)

# 깃이 콘텐츠를 저장하는 방법
깃은 "content-addressable (내용 주소화)" file system이다. 즉, 깃에 들어가는 정보는 key-value의 간단한 형식의 데이터이다. 그렇기 때문에 파일 확장자를 구분하지 않고 어떤 파일이든 깃에 올릴 수 있다. 올라간 파일에 대해 고유한 key를 만드는 역할을 깃이 해준다.

깃은 UNIX 파일 시스템과 유사한 방식으로 컨텐츠를 저장한다. 다만 그보다는 단순화된 방식을 사용하고 있다. 잠깐 UNIX 파일 시스템에서는 어떻게 파일에 대한 정보를 관리하는지 짚고 가자. 아래 사진은 실제 필자가 직접 쓰고 있는 리눅스 가상머신에서 실행한 결과이다.
![file info](https://broccolism.github.io/assets/img/others/2020-05-21-1.JPG){ :width = "85%" }
shell에서 `stat <file name>`을 입력하면 위와 같은 정보를 알 수 있다.
- 파일 이름
- 해당 파일을 위해 쓰인 block 갯수
- 파일의 형식: `regular file`
    - UNIX file system에서 구분하는 파일 형식은 아래 4가지가 있다.
        - 일반 (ordinary): 사용자 프로그램
        - 폴더 (directory): 파일 시스템만 이 파일에 기록을 할 수 있고, 사용자 프로그램은 읽기만 할 수 있다.
        - 특별 (special): 터미널이나 프린터와 같은 입출력 장치들의 접근을 위해 사용
        - 지명 (named): named pipe, 지명 파이프라고 되어있는데 정확한 의미는 아직 잘 모르겠지만 프로세스 간 통신 기법 중 하나라고 한다.
- 파일의 크기
등 여러가지 정보와 함께 파일에 마지막으로 접근한 시각, 파일을 마지막으로 수정한 시각 등 시간 정보도 함께 들어있다. 더 자세한 내용은 [이곳](https://www.thegeekstuff.com/2009/07/unix-stat-command-how-to-identify-file-attributes/)에서 확인할 수 있다.

다시 깃으로 돌아오자. 깃에서는 모든 컨텐츠를 *트리*와 *Blob* object로 저장한다. 이 때 트리는 UNIX file system의 *directory*에 해당하는 트리이고, *Blob*은 UFS의 *inode* 혹은 파일에 해당한다고 한다.

```
owner@DESKTOP-HN3V599 MINGW64 /d/git_broccolism.github.io (master)
$ git cat-file -p master^{tree}
100644 blob 9af87175609d3eabe55e49218ef9489b91a7cd82    .babelrc
100644 blob 7d19cc0d904989dda7051ed67800288fe2c221cb    .eslintignore
100644 blob dc27b26b62e76b10de8608f184aa527b5cc5fa68    .eslintrc
...
040000 tree a582ca4a8afb0ff0f874d2827d9b5ccf96c84ac6    _data
040000 tree 46c0e39c198656c50044ac2431040a70a391d43e    _featured_categories
040000 tree f1e502327be46559f7cc6bbc3920de40ca1b8cfe    _featured_tags
...
100644 blob 67db3ccc802dba8f3647f16162f9c7ba42c281d2    robots.txt
100644 blob 6dbd7cc9702553e98ed7e45abe06c938c0c74151    robots.xml
100644 blob 9ccf1c46fe9c74bae1fc04ef16f08073a4b08d7e    search.html
```

직접 이 블로그를 구성하고 있는 폴더에서 확인해보았다.
![folders as tree](https://broccolism.github.io/assets/img/others/2020-05-21-2.JPG){ :width = "85%" }
맨 끝에 파일 이름이 나온다. 먼저 directory에 해당하는 콘텐츠는 모두 `tree` 형식,
![files as blob](https://broccolism.github.io/assets/img/others/2020-05-21-3.JPG){ :width = "85%" }
그리고 일반 파일에 해당하는 콘텐츠는 모두 `blob` 형식임을 알 수 있다. (스크린샷에서 README.md는 보이지 않는데, 스크롤을 올려보면 위쪽에서 잘 보여지고 있었다.)
- 여기서 가장 앞쪽의 `100644`는 일반 파일을, `040000`은 폴더임을 의미한다.
- `tree`, `blob` 키워드 뒤에 이어지는 복잡한 문자열은 각 콘텐츠별로 부여한 key이다.

여기서 `git cat-file -p <key>`를 입력하면 해당 파일을 볼 수 있다. 아래에 입력한 키는 README.md 파일에게 부여한 키값이다.
![readme.de](https://broccolism.github.io/assets/img/others/2020-05-21-4.JPG){ :width = "85%" }

# `blob` object에서 무엇을 확인할 수 있을까?
`git cat-file <option> <key>` 명령어를 사용해서 깃이 인식하고 있는 컨텐츠에 대한 정보를 확인할 수 있다. 확인할 수 있는 정보의 목록은 아래와 같다.
![info](https://broccolism.github.io/assets/img/others/2020-05-21-5.JPG){ :width = "85%" }

다시 README.md의 간단한 정보를 출력해보자면...
![info](https://broccolism.github.io/assets/img/others/2020-05-21-6.JPG){ :width = "85%" }
일반 파일이기 때문에 `-t`를 주면 `blob`이 나온다. 파일 크기는 byte 단위로 나오고 있다.

그런데 잘 보면 마지막으로 수정한 시각과 같은 시간 정보는 목록에 뜨지 않았다. 대체 어떻게 파일이 수정된 것을 알 수 있을까?

# 파일 변화를 감지하는 방법
그래서 직접 파일을 수정해보았다. 이번에도 역시 실험대상은 README.md이다.
![prev](https://broccolism.github.io/assets/img/others/2020-05-21-7.JPG){ :width = "85%" }
![testing](https://broccolism.github.io/assets/img/others/2020-05-21-8.JPG){ :width = "85%" } 
위와 같이 마지막에 두 줄을 추가하고 푸시를 해보았다.