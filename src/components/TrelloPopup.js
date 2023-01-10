import Component from '../core/Component.js';

class TrelloPopup extends Component {
  /**
   * card title 변경
   *
   * 1. card title을 클릭하면 textarea 요소에 입력이 가능하게 된다.
   * 2. card title을 변경하고 Enter 키를 누르면 card title을 변경한다.
   * 3. 입력 값이 공백인 상태에서 Enter 키를 누르거나 card title에서 Escape 키를 누르면 card title을 변경하지 않고 이전 값으로 되돌린다.
   */
  /**
   * card description 생성/변경
   *
   * 1. Descript 하단의 “Add a more detailed description...”(이미 입력한 card decscription이 있는 경우 card decscription) 버튼을 클릭하면 입력 form을 오픈한다.
   * 2.textarea에서 Enter 키를 누르면 card descripion을 생성/변경하지 말고 개행한다.
   * 3. Save 버튼을 클릭하면 card descripion을 생성/변경한다. 이때 card의 card title 아래 card descripion이 존재함을 알리는 아이콘을 표시한다.
   * 4. Save 버튼 오른쪽의 X 버튼을 틀릭하거나 textarea에서 Escape 키를 누르면 입력 form을 클로즈한다.
   */
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
              <textarea placeholder="Add a more detailed description..."></textarea>
              <button type="submit" class="add-description-btn fill-btn">Save</button>
              <button type="button" class="close-description-btn ghost-btn">X</button>
            </form>
          </div>

          <button type="button" class="close-popup-btn">X</button>
        </article>
      </aside>
    `;
  }
}

export default TrelloPopup;
