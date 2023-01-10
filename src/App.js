import Component from './core/Component.js';
import { TrelloList } from './components/index.js';
import trello from './temp/mockData.js';

class App extends Component {
  render() {
    this.state = window.localStorage.getItem('trello') ?? trello;
    const { list, isOpenedListForm } = this.state;

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
    // TODO: list, isOpenedListForm 옵셔널 체이닝을 내부에서 해야하는지 고민해보기
    // prettier-ignore
    return `
      <header class="global-header">
        <i class='bx bxs-dashboard'></i>
        <h1>Trello</h1>
      </header>

      <main class="main">
        ${list.map(item => new TrelloList({
          trelloList: item
        }).render()).join('') ?? ''}

        <article class="add-list-article">
          <button class="add-another-btn ghost-btn">+ Add another list</button>
          
          <form class="add-list add-form list-container ${isOpenedListForm ? '' : 'hidden'}">
            <textarea placeholder="Enter list title..."></textarea>
            <button type="submit" class="add-list-btn fill-btn">Add list</button>
            <button type="button" class="close-list-btn ghost-btn">X</button>
          </form>
        </article>
      </main>
    `;
  }

  // textarea에 list title을 입력한 다음 Enter 키를 누르거나 Add list 버튼을 클릭하면 list를 생성한다. -> 빈 값일 때 form 유지
  addList(e) {
    console.log('[submit이벤트]');
    const { value } = e.target.querySelector('textarea');

    if (value.trim() === '') return;

    this.setState({
      list: [
        ...this.state.list,
        {
          id: this.generateNextId(this.state.list),
          title: value,
          cards: [],
          isOpenedCardForm: false,
        },
      ],
    });
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

  // X 버튼을 클릭하거나 textarea에서 Escape 키를 누르면 입력 form을 클로즈
  closeForm(e) {
    const parentAddForm = e.target.closest('.add-form');

    parentAddForm.querySelector('textarea').value = '';
    parentAddForm.classList.add('hidden');

    if (parentAddForm.classList.contains('add-list')) {
      this.setState({ isOpenedListForm: false });
    } else {
      this.setState({
        list: this.state.list.map(item =>
          item.id === +parentAddForm.closest('article').dataset.listId ? { ...item, isOpenedCardForm: false } : item
        ),
      });
    }
  }

  clickCloseForm(e) {
    // console.log('[click이벤트]');
    this.closeForm(e);
  }

  /**
   * 초기 렌더링
   *
   * 4.
   * 5. + Add another list 버튼을 클릭하면 입력 form을 오픈한다.
   */

  addEventListener() {
    return [
      { type: 'submit', selector: '.add-list', handler: this.addList },
      { type: 'click', selector: '.close-list-btn', handler: this.clickCloseForm },
      // { type: 'keydown', selector: '.add-list', handler: this.closeForm },
    ];
  }
}

export default App;
