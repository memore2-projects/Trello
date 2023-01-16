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

## addEventListener는 동일한 핸들러를 호출할 때 브라우저에 중복으로 등록하지 않는다.

- addEventListener 매서드를 호출하는 노드에 이미 동일한 핸들러가 존재하면 중복등록하지 않는다.

[참조페이지 MDN] https://developer.mozilla.org/ko/docs/Web/API/EventTarget/addEventListener

once -> addEventListener의 옵션에 once:true를 설정하면 핸들러를 한번 호출하고 브라우저에서 제거한다.

## selector를 window가 아닌 다른걸로 줬을 때, popup-wrapper를 클릭하고 키를 입력하면 keydown 이벤트가 동작하지 않았다. 이유는?

- keydown 이벤트는 input이나 contentEditable, tabindex="-1" 속성을 가진 element에 포커스가 이동해야 이벤트가 발생한다.
- window에 이벤트를 등록하면 항상 동작하는데

contenteditable -> true로 속성을 추가하면 해당 element는 편집이 가능하다.(input/text처럼 동작)

```html
<div contenteditable="true">하이</div>
```
