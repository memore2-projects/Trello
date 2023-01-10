import Component from '../core/Component.js';
import TrelloCard from './TrelloCard.js';

class TrelloList extends Component {
  /**
   * 2. textarea에 card title을 입력한 다음 Enter 키를 누르거나 Add card 버튼을 클릭하면 list를 생성한다.
   * 3. textarea에 card title을 입력하지 않은 상태에서 Enter 키를 누르거나 Add card 버튼을 클릭하면 card를 생성하지 않는다. 입력 form은 그 상태를 그대로 유지한다.
   * 4. textarea에서 Escape 키를 누르면 입력 form을 클로즈한다.
   */

  /**
   * list title 변경
   * 1. list title을 클릭하면 textarea 요소에 입력이 가능하게 된다.
   * 2. list title을 변경하고 Escape나 Enter 키를 누르면 list title이 변경한다.
   * 3. 입력값이 이전 값과 동일하면 list title을 변경하지 않는다.
   * 4. 입력값이 공백이면 list title을 변경하지 않고 이전 값으로 되돌린다.
   */

  render() {
    const { id, title, cards, isOpenedCardForm } = this.props.trelloList;

    // prettier-ignore
    return `
      <article class="trello-list list-container" data-list-id="${id}">
        <h2 class="trello-list-title">
          <label for="trello-list-input">${title}</label>
          <input
            type="text" 
            id="trello-list-input" 
            class="trello-list-input"
          />
        </h2>

        <ul class="cards">
          ${cards.map(card => new TrelloCard({
            card
          }).render()).join('')}
        </ul>

        <button class="add-open-btn ghost-btn">+ Add a card</button>

        <form class="add-card add-form ${isOpenedCardForm ? '' : 'hidden'}">
          <textarea placeholder="Enter a title for this card..."></textarea>
          <button type="submit" class="add-card-btn fill-btn">Add card</button>
          <button type="button" class="close-card-btn ghost-btn">X</button>
        </form>
      </article>
    `;
  }

  addEventListener() {
    const { openForm, closeForm, handleKeydownForm, addCard } = this.props;

    return [
      { type: 'click', selector: '.add-open-btn', handler: openForm },
      { type: 'click', selector: '.close-card-btn', handler: closeForm },
      { type: 'keydown', selector: '.add-card', handler: handleKeydownForm },
      { type: 'submit', selector: '.add-card', handler: addCard },
    ];
  }
}

export default TrelloList;
