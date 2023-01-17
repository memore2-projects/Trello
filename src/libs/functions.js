const setFocusTo = $target => {
  const { length } = $target.value;

  $target.focus();
  $target.setSelectionRange(length, length);
};

const getIds = (dataset, selector, target = document) =>
  [...target.querySelectorAll(selector)].map(item => +item.dataset[dataset]);

export { setFocusTo, getIds };
