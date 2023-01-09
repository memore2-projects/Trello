import Component from '../core/Component.js';

class TrelloList extends Component {
  /**
   * 1.+ Add a card 버튼을 클릭하면 입력 form을 오픈한다. X 버튼을 클릭하거나 textarea에서 Escape 키를 누르면 입력 form을 클로즈한다.
   * 2.textarea에 card title을 입력한 다음 Enter 키를 누르거나 Add card 버튼을 클릭하면 list를 생성한다.
   * 3.textarea에 card title을 입력하지 않은 상태에서 Enter 키를 누르거나 Add card 버튼을 클릭하면 card를 생성하지 않는다. 입력 form은 그 상태를 그대로 유지한다.
   * 4.textarea에서 Escape 키를 누르면 입력 form을 클로즈한다.
   */
  /**
   * list title 변경
   * 1.list title을 클릭하면 textarea 요소에 입력이 가능하게 된다.
   * 2.list title을 변경하고 Escape나 Enter 키를 누르면 list title이 변경한다.
   * 3.입력값이 이전 값과 동일하면 list title을 변경하지 않는다.
   * 4.입력값이 공백이면 list title을 변경하지 않고 이전 값으로 되돌린다.
   */
}

export default TrelloList;
