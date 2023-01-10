import Component from '../core/Component.js';
import TrelloCard from './TrelloCard.js';

class TrelloList extends Component {
  render() {
    const { id, title, cards, isOpenedCardForm } = this.props.trelloList;

    // prettier-ignore
    return `
      <article class="trello-list list-container" data-item-id="${id}">
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
          ${cards.map(card => new TrelloCard({
            itemId: id,
            itemTitle: title,
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
      </article>
    `;
  }

  addEventListener() {
    const { changeListTitle, openForm, closeForm, handleKeydownForm, addCard } = this.props;

    return [
      { type: 'keydown', selector: '.trello-list-input', handler: changeListTitle },
      { type: 'click', selector: '.add-open-btn', handler: openForm },
      { type: 'click', selector: '.close-card-btn', handler: closeForm },
      { type: 'keydown', selector: '.add-card', handler: handleKeydownForm },
      { type: 'submit', selector: '.add-card', handler: addCard },
    ];
  }
}

export default TrelloList;
