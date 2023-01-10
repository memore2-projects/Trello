import Component from '../core/Component.js';

class TrelloCard extends Component {
  render() {
    const { id, title, description } = this.props.card;

    return `
      <li class="card-item" data-card-id="${id}">
        <button class="open-card-btn">
          ${title}
          ${description ? '<i class="bx bx-align-right"></i>' : ''}
        </button>
      </li>
    `;
  }

  addEventListener() {
    return [
      {
        type: 'click',
        selector: '.open-card-btn',
        handler: this.props.openPopup,
      },
    ];
  }
}

export default TrelloCard;
