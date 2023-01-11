import Component from './core/Component.js';
import { TrelloList, TrelloPopup } from './components/index.js';
import trello from './temp/mockData.js';

class App extends Component {
  constructor() {
    super();

    this.clientState = {
      editModeCard: {
        itemId: 0,
        itemTitle: '',
        card: null,
      },
      isOpenedPopup: false,
      isOpenedDescription: false,
    };

    this.serverState = JSON.parse(window.localStorage.getItem('trello')) ?? trello;
  }

  render() {
    const { list, isOpenedListForm } = this.serverState;
    const { isOpenedPopup } = this.clientState;

    document.body.classList.toggle('opened-popup', isOpenedPopup);

    // TODO: list, isOpenedListForm 옵셔널 체이닝을 내부에서 해야하는지 고민해보기
    // prettier-ignore
    return `
      <header class="global-header">
        <i class='bx bxs-dashboard'></i>
        <h1>Trello</h1>
      </header>

      <main class="main">
        ${list.map(item => new TrelloList({
          trelloList: item,
          changeListTitle: this.changeListTitle.bind(this),
          openForm: this.openForm.bind(this),
          handleKeydownForm: this.handleKeydownForm.bind(this),
          closeForm: this.closeForm.bind(this),
          addCard: this.addCard.bind(this),
          openPopup: this.openPopup.bind(this),
          dragStart: this.dragStart.bind(this),
          dragEnter: this.dragEnter.bind(this),
          dragOver: this.dragOver.bind(this),
          dragDrop: this.dragDrop.bind(this),
        }).render()).join('') ?? ''}

        <article class="add-list-article">
          <button class="add-another-btn ghost-btn ${isOpenedListForm ? 'hidden' : ''}">+ Add another list</button>
          
          <form class="add-list add-form list-container ${isOpenedListForm ? '' : 'hidden'}">
            <textarea placeholder="Enter list title..." autofocus></textarea>
            <button type="submit" class="add-list-btn fill-btn">Add list</button>
            <button type="button" class="close-list-btn ghost-btn">X</button>
          </form>
        </article>
      </main>

      ${isOpenedPopup ? new TrelloPopup({
        ...this.clientState,
        closePopup: this.closePopup.bind(this),
        clickPopupOuter: this.clickPopupOuter.bind(this),
        keydownEscPopup: this.keydownEscPopup.bind(this),
        changeCardTitle: this.changeCardTitle.bind(this),
        openForm: this.openForm.bind(this),
        changeDescription: this.changeDescription.bind(this),
        closeForm: this.closeForm.bind(this),
        keydownEscDescription: this.keydownEscDescription.bind(this),
      }).render() : ''}
    `;
  }

  /* --------------------------------- 재사용 함수 --------------------------------- */

  generateNextId(targetArr) {
    // prettier-ignore
    return Math.max(0, +targetArr.length) + 1;
  }

  findItem(itemId) {
    return this.serverState.list.find(item => item.id === +itemId);
  }

  mapList(itemId, newItem) {
    return this.serverState.list.map(item => (item.id === +itemId ? newItem : item));
  }

  setFocusTo($target) {
    const { length } = $target.value;

    $target.focus();
    $target.setSelectionRange(length, length);
  }

  /* ------------------------------ drag handler ------------------------------ */
  dragStart(e) {
    this.dragItem = e.target.closest('.trello-list');

    console.log('starttarget', e.target);
    console.log('startdragItem', this.dragItem);
    // this.dragItem.classList.add('dragged');
  }

  dragEnter(e) {
    // dom을 직접 조작

    e.preventDefault();
    if (e.target.closest('.trello-list') === this.dragItem) return;

    const enteredItem = e.target.closest('.trello-list');
    const standardOffset = enteredItem.getBoundingClientRect().left;
    const $main = document.querySelector('.main');

    if (e.pageX > standardOffset) {
      const $item = this.dragItem;
      console.log('enterItem', $item);
      const $itemClone = $item.cloneNode(true);
      const $changeItem = e.target.closest('.trello-list');
      const $changeItemClone = $changeItem.cloneNode(true);

      $main.replaceChild($itemClone, $changeItem);
      $main.replaceChild($changeItemClone, $item);

      this.dragItem = $itemClone;
    }
  }

  dragOver(e) {
    e.preventDefault();
  }

  dragDrop(e) {
    // state를 변경 랜더일어나고
    const data = e.dataTransfer.getData('item');
    console.log('drop', data);
  }

  /* ---------------------------- 공통 event handler ---------------------------- */

  // + Add another list 버튼을 클릭하면 입력 form을 오픈한다.
  openForm(e) {
    const $siblingAddForm = e.target.nextElementSibling;
    $siblingAddForm.classList.remove('hidden');

    if ($siblingAddForm.classList.contains('add-list')) {
      this.setServerState({ isOpenedListForm: true });
    } else if ($siblingAddForm.classList.contains('add-card')) {
      const { itemId } = $siblingAddForm.closest('article').dataset;
      const item = this.findItem(itemId);

      this.setServerState({ list: this.mapList(itemId, { ...item, isOpenedCardForm: true }) });
    } else {
      this.setClientState({ isOpenedDescription: true });

      const $textarea = document.querySelector('.add-description textarea');
      this.setFocusTo($textarea);
    }
  }

  handleKeydownForm(e) {
    if (e.key === 'Escape') this.closeForm(e);

    if (e.key === 'Enter' && !e.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      e.target.closest('.add-list') ? this.addList(e) : this.addCard(e);
    }
  }

  // X 버튼을 클릭하거나 textarea에서 Escape 키를 누르면 입력 form을 클로즈
  closeForm(e) {
    const $parentAddForm = e.target.closest('.add-form');

    $parentAddForm.querySelector('textarea').value = '';
    $parentAddForm.classList.add('hidden');

    if ($parentAddForm.classList.contains('add-list')) {
      this.setServerState({ isOpenedListForm: false });
    } else if ($parentAddForm.classList.contains('add-card')) {
      const { itemId } = $parentAddForm.closest('article').dataset;
      const item = this.findItem(itemId);

      this.setServerState({ list: this.mapList(itemId, { ...item, isOpenedCardForm: false }) });
    } else {
      this.setClientState({ isOpenedDescription: false });
    }
  }

  /* ------------------------------ list handler ------------------------------ */

  // textarea에 list title을 입력한 다음 Enter 키를 누르거나 Add list 버튼을 클릭하면 list를 생성한다. -> 빈 값일 때 form 유지
  addList(e) {
    const { value } = e.target.querySelector('textarea') ?? e.target;

    if (value.trim() === '') return;

    this.setServerState({
      list: [
        ...this.serverState.list,
        {
          id: this.generateNextId(this.serverState.list),
          title: value,
          cards: [],
          isOpenedCardForm: false,
        },
      ],
    });

    document.querySelector('.add-list textarea').focus();
  }

  /**
   * list title을 변경: Escape나 Enter 키를 누르면 list title이 변경한다.
   * - 입력값이 이전 값과 동일하면 list title을 변경하지 않는다.
   * - 입력값이 공백이면 list title을 변경하지 않고 이전 값으로 되돌린다.
   */
  changeListTitle(e) {
    if (e.key !== 'Escape' && e.key !== 'Enter') return;
    if (e.isComposing || e.keyCode === 29) return;

    const { itemId } = e.target.closest('.trello-list').dataset;
    const originTitle = this.findItem(itemId).title;
    const newTitle = e.target.value.trim();

    e.target.blur();

    if (newTitle === originTitle || newTitle === '') {
      e.target.value = originTitle;
      return;
    }

    const item = this.findItem(itemId);

    this.setServerState({ list: this.mapList(itemId, { ...item, title: newTitle }) });
  }

  /* ------------------------------ card handler ------------------------------ */

  // textarea에 card title을 입력한 다음 Enter 키를 누르거나 Add card 버튼을 클릭하면 card를 생성한다
  addCard(e) {
    const { value } = e.target.querySelector('textarea') ?? e.target;

    if (value.trim() === '') return;

    const { itemId } = e.target.closest('.trello-list').dataset;
    const item = this.findItem(itemId);
    const newList = this.mapList(itemId, {
      ...item,
      cards: [...item.cards, { id: this.generateNextId(item.cards), title: value, description: '' }],
    });

    this.setServerState({ list: newList });
  }

  /* ------------------------------ popup handler ----------------------------- */

  openPopup(e) {
    const { itemId } = e.target.closest('.trello-list').dataset;
    const item = this.findItem(itemId);
    const { cardId } = e.target.closest('.card-item').dataset;
    const { title, description } = item.cards.find(card => card.id === +cardId);

    this.setClientState({
      editModeCard: {
        itemId: +itemId,
        itemTitle: item.title,
        card: { id: +cardId, title, description },
      },
      isOpenedPopup: true,
    });
  }

  // popup 비활성화 (공통)
  closePopup() {
    this.setClientState({
      editModeCard: {
        itemId: 0,
        itemTitle: '',
        card: null,
      },
      isOpenedPopup: false,
      isOpenedDescription: false,
    });
  }

  // popup 비활성화 (외부 영역 클릭시)
  clickPopupOuter(e) {
    if (!e.target.closest('.popup-wrapper')) this.closePopup();
  }

  // popup 비활성화 (Escape 키를 눌렀을 때)
  // TODO: selector를 window가 아닌 다른걸로 줬을 때, popup-wrapper를 클릭하고 키를 눌렀을 떄 keydown 이벤트가 동작하지 않았다. 이유는?
  keydownEscPopup(e) {
    if (e.key !== 'Escape' || !document.body.classList.contains('opened-popup')) return;
    if (e.target.matches('.popup-title-input') || e.target.matches('.add-description textarea')) return;

    this.closePopup();
  }

  /**
   * card title을 변경하고 Enter 키를 누르면 card title을 변경한다.
   * - 입력 값이 이전 값과 동일하면 card title을 변경하지 않는다.
   * - 입력 값이 공백인 상태에서 Enter 키를 누르거나 card title에서 Escape 키를 누르면 card title을 변경하지 않고 이전 값으로 되돌린다.
   */
  changeCardTitle(e) {
    if (e.key !== 'Enter' && e.key !== 'Escape') return;
    if (e.isComposing || e.keyCode === 229) return;

    const newTitle = e.target.value.trim();
    const clientCard = this.clientState.editModeCard;
    const { title: originTitle, id: cardId } = clientCard.card;

    e.target.blur();

    if (newTitle === originTitle || newTitle === '') {
      e.target.value = originTitle;
      return;
    }

    clientCard.card.title = newTitle;

    const item = this.findItem(clientCard.itemId);
    const newList = this.mapList(clientCard.itemId, {
      ...item,
      cards: item.cards.map(card => (card.id === cardId ? { ...card, title: newTitle } : card)),
    });

    this.setServerState({ list: newList });
  }

  // Save 버튼을 클릭하면 card descripion을 생성/변경한다. 이때 card의 card title 아래 card descripion이 존재함을 알리는 아이콘을 표시한다.
  changeDescription(e) {
    const { value } = e.target.previousElementSibling;
    const clientCard = this.clientState.editModeCard;

    clientCard.card.description = value;
    this.clientState.isOpenedDescription = false;

    const item = this.findItem(clientCard.itemId);
    const newList = this.mapList(clientCard.itemId, {
      ...item,
      cards: item.cards.map(card => (card.id === clientCard.card.id ? { ...card, description: value } : card)),
    });

    this.setServerState({ list: newList });
  }

  // textarea에서 Escape 키를 누르면 입력 form을 클로즈한다.
  keydownEscDescription(e) {
    if (e.key === 'Escape') this.closeForm(e);
  }

  // const trello = {
  //   list: [
  //     {
  //       id: 1,
  //       title: 'todo',
  //       cards: [
  //         { id: 1, title: '시작', description: '' },
  //         { id: 2, title: '끝', description: '끝났다.' },
  //       ],
  //       isOpenedCardForm: false,
  //     },
  //     {
  //       id: 2,
  //       title: '시작',
  //       cards: [
  //         { id: 1, title: '두번쨰', description: '' },
  //         { id: 2, title: 'ㄴㄹㄷㄹ', description: '끝났다.' },
  //       ],
  //       isOpenedCardForm: false,
  //     },
  //   ],
  //   isOpenedListForm: true,
  // };

  /**
   * list 이동
   * 1. list를 drag & drop한다.
   * 2. list를 drag할 때 list의 이동이 사용자에게 보여져야 하므로 상태 변경없이 DOM을 직접 변경하고 drop한 이후에 상태를 변경한다.
   */

  /**
   * card 이동
   *
   * 1.card를 drag & drop한다.
   * 2.card를 drag할 때 card의 이동이 사용자에게 보여져야 하므로 상태 변경없이 DOM을 직접 변경하고 drop한 이후에 상태를 변경한다.
   *
   *  card를 다른 card 위로 drag하는 경우
   * 1. 다른 card의 중앙보다 마우스 커서가 위에 위치하면 drag 중인 card를 다른 card의 위로 이동시킨다.
   * 2. 다른 card의 중앙보다 마우스 커서가 아래에 위치하면 drag 중인 card를 다른 card의 아래로 이동시킨다.
   *
   * card를 다른 card 위로 drag하지 않는 경우
   * 1. drag 중인 마우스 커서의 x축 좌표 내에 위치한 list의 최하단에 drag 중인 card를 이동시킨다.
   * 2. list 외부에 card를 drop해도 정상적으로 동작해야 한다.
   */

  /**
   * popup 활성화
   *
   * 1. card를 클릭하면 해당 card의 title과 description을 편집할 수 있는 popup을 활성화한다. 이때 아래와 같이 card title과 list title을 표시한다.
   * 2. 만약 이미 입력한 card decscription이 있으면 description 출력.
   * 3. 만약 이미 입력한 card decscription이 없으면 "Add a more detailed description..."
   * 4. 다음의 경우 popup을 비활성화한다.
   *   - 활성화된 popup의 영역 외부를 클릭
   *   - popup 우측 상단의 X 버튼을 클릭
   *   - Escape 키를 눌렀을 때
   */

  // TODO: 모든 이벤트에 preventDefault를 사용했을 때 click이벤트는 동작하는데 submit 이벤트는 동작하지 않는다. -> 해결: submit이벤트인 경우에만 preventDefault를 적용했다. -> 원인을 찾아보자
  addEventListener() {
    return [
      { type: 'submit', selector: '.add-list', handler: this.addList.bind(this) },
      { type: 'click', selector: '.add-another-btn', handler: this.openForm.bind(this) },
      { type: 'click', selector: '.close-list-btn', handler: this.closeForm.bind(this) },
      { type: 'keydown', selector: '.add-list', handler: this.handleKeydownForm.bind(this) },
    ];
  }
}

export default App;
