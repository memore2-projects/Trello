const trello = {
  list: [
    {
      id: 1,
      title: 'todo',
      cards: [
        { id: 1, title: '시작', description: '' },
        { id: 2, title: '끝', description: '끝났다.' },
      ],
      isOpenedCardForm: false,
    },
    {
      id: 2,
      title: '시작',
      cards: [
        { id: 1, title: '두번쨰', description: '' },
        { id: 2, title: 'ㄴㄹㄷㄹ', description: '끝났다.' },
      ],
      isOpenedCardForm: false,
    },
  ],
  isOpenedListForm: true,
};

export default trello;
