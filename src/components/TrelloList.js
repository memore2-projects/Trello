import Component from '../core/Component.js';
import TrelloCard from './TrelloCard.js';

class TrelloList extends Component {
  render() {
    const { id, title, cards, isOpenedCardForm } = this.props.trelloList;

    // prettier-ignore
    return `
      <article class="trello-list" data-item-id="${id}" >
        <div class="list-container" draggable="true">
          <h2 class="trello-list-title input-wrapper">
            <label for="trello-list-input">${title}</label>
            <input
              type="text" 
              id="trello-list-input" 
              class="trello-list-input"
              value="${title}"
            />
          </h2>

          <ul class="cards">
            ${cards.map(card =>
                new TrelloCard({
                  card,
                  openPopup: this.props.openPopup,
                }).render()).join('')}
          </ul>

          <div class="add-wrapper">
            <button class="add-open-btn ghost-btn ${isOpenedCardForm ? 'hidden' : ''}">+ Add a card</button>

            <form class="add-card add-form ${isOpenedCardForm ? '' : 'hidden'}">
              <textarea placeholder="Enter a title for this card..."></textarea>
              <button type="submit" class="add-card-btn fill-btn">Add card</button>
              <button type="button" class="close-card-btn ghost-btn">X</button>
            </form>
          </div>
        </div>
      </article>
    `;
  }

  addEventListener() {
    const {
      changeListTitle,
      openForm,
      closeForm,
      handleKeydownForm,
      addCard,
      dragStart,
      dragEnter,
      dragOver,
      dragDrop,
      dragEnd,
    } = this.props;

    return [
      { type: 'keydown', selector: '.trello-list-input', handler: changeListTitle },
      { type: 'click', selector: '.add-open-btn', handler: openForm },
      { type: 'click', selector: '.close-card-btn', handler: closeForm },
      { type: 'keydown', selector: '.add-card', handler: handleKeydownForm },
      { type: 'submit', selector: '.add-card', handler: addCard },
      { type: 'dragstart', selector: '.trello-list .list-container', handler: dragStart },
      { type: 'dragenter', selector: '.trello-list', handler: dragEnter },
      // selector에 window를 하지 않고 body를 한 이유: window는 중복검사를 하지 않아서 TrelloList 인스턴스가 생성될떄마다 이벤트가 새롭게 등록되어 중복이 발생한다.
      { type: 'dragover', selector: 'body', handler: dragOver },
      { type: 'drop', selector: 'body', handler: dragDrop },
      { type: 'dragend', selector: 'body', handler: dragEnd },
    ];
  }
}

export default TrelloList;
