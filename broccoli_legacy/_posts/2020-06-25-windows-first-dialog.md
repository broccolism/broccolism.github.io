---  
layout: post  
title: "[Windows] First Dialog"
categories: study
tags: study 2020-2 dialog windows handle C++ programming
comments: true
---

- 예제 코드 및 일부 설명 출처: [https://eine.tistory.com/entry/Win32-API로-Hello-World-프로그램-작성하기](https://eine.tistory.com/entry/Win32-API%EB%A1%9C-Hello-World-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8-%EC%9E%91%EC%84%B1%ED%95%98%EA%B8%B0)
- 🔼 윈도우 프로그래밍을 아무리 검색해도 기초적인 글이 잘 보이지 않아 겨우 찾은 링크. 안드로이드 프로그래밍 기초라고 검색하면 포스팅이 꽤 많이 뜨는데... 혹시나 도움이 될까 싶어 이 글을 올립니다.
- 나머지 출처: [마이크로소프트 docs](https://docs.microsoft.com/en-us/windows/win32/)

```cpp
#define WIN32_LEAN_AND_MEAN

#include <windows.h>
#include <tchar.h>

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nShowCmd)
{
	MessageBox(NULL, _T("\tHello, World!"), _T("My First Win32 App"), NULL);
	return 0;
}
```

![result](https://broccolism.github.io/assets/img/windows/2020-06-25-1.jpg){: width="30%" }

## 코드 설명

```cpp
#define WIN32_LEAN_AND_MEAN
```

- Cryptography, Shell 등 잘 사용되지 않는 API를 제외시켜서 윈도우즈 헤더 파일의 크기를 줄일 수 있다.
    - 빌드 시간이 단축된다.
- `#include <windows.h>` 이전에 적어줘야한다.

```cpp
#include <windows.h>
#include <tchar.h>
```

- `tchar.h` 헤더는 `_T` 매크로 함수를 사용하기 위해 include한 것이다.
    - **_T(x)** 는 C/C++에서 `char *` 타입을 갖는 문자열이 유니코드 문자열과 호환되게 만들어주는 함수다.

```cpp
int WINAPI WinMain(HINSTANCE hInstance,
				    HINSTANCE hPrevInstance,
					LPSTR lpCmdLine,
					int nShowCmd)								
```

- `int` 뒤에 붙여준 `WINAPI` 는 함수의 calling convention을 지정해준다.
    - **calling convention(호출 규약)**: 함수가 어떻게 implement되고 machine에서 어떻게 call되는지 결정 표준 방식.
        - 컴파일러가 subroutine을 생성하기 위해 어떻게 해야할 지 정해준다.
            - e.g) 함수에 argument가 어떻게 전달되는지, 함수의 return value가 어떻게 전달되는지, 함수가 어떻게 불리는지, 함수가 스택 및 스택 프레임을 어떻게 관리하는지 등등!
        - (생각해보니 시스템 프로그래밍 때 배웠던 내용이다. 이래서 복습을 해야해)
    - calling convention을 따로 지정하지 않으면 (지금껏 그래왔듯이) C의 calling convention이 그대로 지정된다.
    - 윈도우즈 응용 프로그램에서는 WINAPI를 지정해줘야 한다.
- `main`이 아닌 `WinMain`이다.
    - 윈도우즈 응용 프로그램 코드의 entry point는 바로 이 함수이다.
- argument들을 살펴보자.
    - `HINSTANCE hInstance`: 응용 프로그램 instance에 대한 handle.
        - **handle**: 특정 instance 혹은 module 에 부여하는 번호.
            - ID라고 보면 된다.
            - 32bit int type이다.
            - OS가 발급해주며, 사용자는 그냥 쓰기만 하면 된다.
                - 바꿔 말하자면 OS를 짜는 사람 입장에선 이 handle이 중복되지 않도록 설계해줘야한다.
                - OS가 **executable (EXE)**를 구분하기 위해 사용하는 값이다.
            - 보통 접두어 `h`로 시작한다.
    - `HINSTANCE hPrevInstance`: 지금은 아무 의미 없는 argument로, 예전 16비트 윈도우 체제에서 쓰이던 것이다.
        - 지금은 항상 `0`을 넘겨주면 된다.
    - `lpCmdLine`: unicode string으로 된 command-line argument를 가리킨다.
    - `nCmdShow`: 메인 윈도우 창의 크기가 최소화/최대화/일반 사이즈 중 어떻게 보일지 결정하는 argument.

```cpp
MessageBox(NULL, _T("\tHello, World!"), _T("My First Win32 App"), NULL);
```

- 시스템 아이콘, 버튼(여러개도 가능), 메세지를 보여주는 다이얼로그 박스를 보여주는 함수.
- return value: 유저가 누른 버튼에 따른 integer 값.
- arguments
    - `HWND hWnd`: 메세지 박스를 만들어내는 윈도우(*owner window*라고 기술되어 있다.)의 핸들.
        - `NULL`일 때에는 owner window가 없음을 의미한다.
        - 그래서 위 코드를 실행시키면 특별한 창 없이 그냥 다이얼로그만 하나 보인다.
    - `LPCTSTR lpText`: 유저에게 보여줄 테스트. 여러줄을 쓸 수도 있다.
    - `LPCTSTR lpCaption`: 다이얼로그 박스의 제목.
        - `NULL`일 때에는 기본적으로 **Error**라는 제목이 설정된다.
    - `UINT uType`: 다이얼로그 박스의 contents와 behavior를 결정한다.
        - [미리 준비된](https://docs.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-messagebox) 여러 플래그를 사용할 수 있다.

---

# Some Windows Data Types

- 뭐가 자주 쓰이는지 모르겠으니 우선은 예제코드에 나와있는 타입부터 먼저 살펴보려고 합니다.

### HINSTANCE

- instance에 대한 핸들. 메모리에 올라가는 모듈의 base address이며, 16-bit 윈도우즈에서는 HMOUDLE과 구분하여 썼지만 지금은 같은 것으로 여긴다.
- **WinDef.h**에 다음과 같이 선언되어있다.
    - `typedef HANDLE HINSTANCE;`

### HWND

- 윈도우에 대한 핸들.
- **WinDef.h**에 다음과 같이 선언되어있다.
    - `typedef HANDLE HWND;`

### LPCTSTR

- **WinNT.h**에 다음과 같이 선언되어있다.

```cpp
#ifdef UNICODE
 typedef LPCWSTR LPCTSTR;
#else
 typedef LPCSTR LPCTSTR;
#endif
```

- 좀 더 자세하게알아보면...
- 대부분의 string operation은 *Unicode*와 *Windows code pages*에 대해 동일하게 작동한다.
    - 이 둘의 차이점은
        - 유니코드는 16-bit character를,
        - 윈도우즈 코드 페이지는 8-bit character를 사용한다는 점이다.
- 윈도우즈는 character와 string data type에 대해 총 세가지 set를 지원한다.
    1. **a set of generic type definitions**: 유니코드와 윈도우즈 코드 페이지 모두 컴파일 가능
    2. **a set of Unicode type definitions**
    3. **a set of Windows code pages**
- 이들 중 generic data type을 사용하는 application은 "UNICODE"를 defining하기만 하면 유니코드 형식으로 컴파일 할 수 있다.
- generic type을 Windows code pages로 컴파일하는 기능도 있는 이유는 legacy application을 지원하기 위해서다.
    - 윈도우즈 코드 페이지로 컴파일하려면 그냥 UNICODE definition을 쓰지 않으면 된다.
- **LPCWSTR**: `\n`로 끝나는 16-bit Unicode character를 가리키는 포인터.
- **LPCSTR**: `\n`로 끝나는 8-bit Windows character를 가리키는 포인터.
- 결론: 적당히 `LPCTSTR` 써주면 될 것 같다.(지금 당장 생각하기엔)