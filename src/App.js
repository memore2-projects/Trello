import Component from './core/Component.js';
import { TrelloList } from './components/index.js';
import trello from './temp/mockData.js';

class App extends Component {
  render() {
    /**
     * 초기 렌더링
     *
     * 1. localstorage에 저장되어 있는 상태를 취득해 초기 렌더링한다.
     * 2. localstorage에 저장되어 있는 상태가 없다면 초기 상태를 제공하고 이를 기반으로 렌더링한다.
     * 3. textarea에 list title을 입력한 다음 Enter 키를 누르거나 Add list 버튼을 클릭하면 list를 생성한다. -> 빈 값일 때 form 유지
     * 4. X 버튼을 클릭하거나 textarea에서 Escape 키를 누르면 입력 form을 클로즈하고, + Add another list 버튼을 클릭하면 입력 form을 오픈한다.
     * 5.
     */

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
     *
     *
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
    return `
      <header>
        <i class='bx bxs-dashboard'></i>
        <h1>Trello</h1>
      </header>
      <main>
      </main>
    `;
  }
}

export default App;
