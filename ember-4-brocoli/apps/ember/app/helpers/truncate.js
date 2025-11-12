import { helper } from '@ember/component/helper';

export default helper(function truncate([text, length = 100]) {
  if (!text) return '';

  if (text.length <= length) {
    return text;
  }

  return text.substring(0, length) + '...';
});
