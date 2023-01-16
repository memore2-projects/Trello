# 회고

## 이벤트 중복확인시 핸들러를 체크하지 않는 이유

- 인스턴스의 addEventListener 매서드를 호출해서 반환받는 이벤트핸들러와 관련된 배열은 eventHolder에 직접적으로 저장되는 것이 아니라 if조건문을 추가해서 새로운 handler함수를 생성한 후에 등록한다.
- 그래서 eventHolder에 등록된 핸들러와 addeventListener 매서드의 핸들러는 다른 함수다.
- 따라서 이벤트 중복 확인시 핸들러의 동일여부를 체크하지 않는다.

```js
const duplicated = eventHolder.find(({ type, selector }) => type === event.type && selector === event.selector);

if (!duplicated) {
  const { selector, handler } = event;

  // handler를 monkey patch한다.
  event.handler = e => {
    if (e.type === 'submit') e.preventDefault();
    // e.target이 selector의 하위 요소일 수도 있다.

    if (e.target.matches(selector) || e.target.closest(selector)) {
      handler(e);
    }
  };

  eventHolder.push(event);
}
```

## eventHolder에 등록된 이벤트의 selector가 window일 때도 이벤트가 중복 등록되는 이유?

- addEventListener 내장 매서드는 호출자(currentTarget)에 동일한 이벤트 핸들러가 존재하면 중복 등록하지 않는데([EventTarget.addEventListener() - MDN](https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener) selector가 window일 때 인스턴스가 새로 생성되면 이벤트가 계속해서 중복 등록되는 현상을 발견했다.
- props로 상태를 변경하는 함수를 하위 컴포넌트에게 전달할 때 함수 내부의 this가 상태를 관리하는 class를 가리키게 하기 위해 `bind` 메서드를 사용했는데, bind 메서드는 원본 함수 객체를 변경하는 것이 아닌 this가 바인딩된 새로운 함수를 생성한다. 따라서 bind를 사용하면 이벤트 핸들러는 기존에 등록된 핸들러와 동일하지 않으므로, 중복 등록되는 것처럼 행동한다. [Function.prototype.bind() - MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- Component 클래스의 holdEvents 메서드에서 selector가 window거나 null 일때도 이벤트 중복을 확인하여 해결했다.

### 코드

- 초기 코드

  ```js
  for (const event of events) {
    if (event.selector === 'window' || event.selector === null) {
      eventHolder.push(event);
      continue;
    }

    const duplicated = eventHolder.find(({ type, selector }) => type === event.type && selector === event.selector);

    if (!duplicated) {
      const { selector, handler } = event;

      // handler를 monkey patch한다.
      event.handler = e => {
        if (e.type === 'submit') e.preventDefault();
        // e.target이 selector의 하위 요소일 수도 있다.

        if (e.target.matches(selector) || e.target.closest(selector)) {
          handler(e);
        }
      };

      eventHolder.push(event);
    }
  }
  ```

- 수정 코드

  ```js
  for (const event of events) {
    const duplicated = eventHolder.find(({ type, selector }) => type === event.type && selector === event.selector);

    if (duplicated) continue;

    const { selector, handler } = event;

    // handler를 monkey patch한다.
    if (event.selector === 'window' || event.selector === null) {
      event.handler = e => handler(e);
    } else {
      event.handler = e => {
        if (e.type === 'submit') e.preventDefault();

        // e.target이 selector의 하위 요소일 수도 있다.
        if (e.target.matches(selector) || e.target.closest(selector)) {
          handler(e);
        }
      };
    }

    eventHolder.push(event);
  }
  ```

## selector를 window가 아닌 다른걸로 줬을 때, popup-wrapper를 클릭하고 키를 입력하면 keydown 이벤트가 동작하지 않았다. 이유는?

- keydown 이벤트는 input이나 contentEditable, tabindex="-1" 속성을 가진 element에 포커스가 이동해야 이벤트가 발생한다.
- window에 이벤트를 등록하면 항상 동작하는데

contenteditable -> true로 속성을 추가하면 해당 element는 편집이 가능하다.(input/text처럼 동작)

```html

```

# 새로 알게 된 것

## addEventListener의 once option

addEventListener 내장 메서드의 옵션으로, addEventListener의 세번째 인수에 once:true를 설정하면 핸들러를 한 번만 호출하고 브라우저에서 자동 제거한다. (removeEventListener를 따로 할 필요가 없다.)
