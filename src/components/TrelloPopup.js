import Component from '../core/Component.js';

class TrelloPopup extends Component {
  render() {
    const { editModeCard, isOpenedDescription } = this.props;
    const { title, description } = editModeCard.card;

    return `
      <aside class="popup">
        <article class="popup-wrapper">
          <header class="popup-header">
            <h3 class="popup-title input-wrapper">
              <label for="popup-title-input">${title}</label>
              <input
                type="text" 
                id="popup-title-input" 
                class="popup-title-input"
                value="${title}"
              />
            </h3>
            <p>in list ${editModeCard.itemTitle}</p>
          </header>
          
          <div class="popup-description">
            <h4>Description</h4>
            <button class="open-description-btn fill-btn ${isOpenedDescription ? 'hidden' : ''}">
              ${description || 'Add a more detailed description...'}
            </button>
            
            <form class="add-description add-form ${isOpenedDescription ? '' : 'hidden'}">
              <textarea placeholder="Add a more detailed description...">${description || ''}</textarea>
              <button type="submit" class="add-description-btn fill-btn">Save</button>
              <button type="button" class="close-description-btn ghost-btn">X</button>
            </form>
          </div>

          <button type="button" class="close-popup-btn">X</button>
        </article>
      </aside>
    `;
  }

  addEventListener() {
    const {
      closePopup,
      clickPopupOuter,
      keydownEscPopup,
      changeCardTitle,
      openForm,
      changeDescription,
      closeForm,
      keydownEscDescription,
    } = this.props;

    return [
      { type: 'click', selector: '.close-popup-btn', handler: closePopup },
      { type: 'click', selector: '.popup', handler: clickPopupOuter },
      { type: 'keydown', selector: 'window', handler: keydownEscPopup },
      { type: 'keydown', selector: '.popup-title-input', handler: changeCardTitle },
      { type: 'click', selector: '.open-description-btn', handler: openForm },
      { type: 'click', selector: '.add-description-btn', handler: changeDescription },
      { type: 'click', selector: '.close-description-btn', handler: closeForm },
      { type: 'keydown', selector: '.add-description textarea', handler: keydownEscDescription },
    ];
  }
}

export default TrelloPopup;
