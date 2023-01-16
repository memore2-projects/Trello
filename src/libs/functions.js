const setFocusTo = $target => {
  const { length } = $target.value;

  $target.focus();
  $target.setSelectionRange(length, length);
};

export { setFocusTo };
