import { helper } from '@ember/component/helper';

export default helper(function momentFormat([date, format]) {
  if (!date) return '';

  const d = new Date(date);

  // Simple date formatting (could use moment.js or date-fns for production)
  if (format === 'DD MMMM YYYY') {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const day = d.getDate().toString().padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  }

  return d.toLocaleDateString();
});
