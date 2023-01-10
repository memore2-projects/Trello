import Component from '../core/Component.js';

class TrelloCard extends Component {
  render() {
    const { id, title, description } = this.props.card;

    return `
      <li class="card-item" data-card-id="${id}">
        <button>
          ${title}
          ${description ? '<i class="bx bx-align-right"></i>' : ''}
        </button>
      </li>
    `;
  }
}

export default TrelloCard;
