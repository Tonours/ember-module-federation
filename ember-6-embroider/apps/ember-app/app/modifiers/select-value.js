import { modifier } from 'ember-modifier';

/**
 * Modifier to set the selected value of a <select> element
 * Usage: <select {{select-value @value}}>
 */
export default modifier(function selectValue(element, [value]) {
  if (element.tagName !== 'SELECT') {
    return;
  }

  // Set the value when modifier is applied or when value changes
  element.value = value || '';
});
