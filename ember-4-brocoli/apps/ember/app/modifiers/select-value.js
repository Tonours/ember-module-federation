import { modifier } from 'ember-modifier';

export default modifier((element, [value]) => {
  if (element.value !== value) {
    element.value = value;
  }
});
