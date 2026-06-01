const formatter = new Intl.NumberFormat('ro-RO', {
  style: 'currency',
  currency: 'RON',
  minimumFractionDigits: 2,
});

export function formatRON(price: number): string {
  return formatter.format(price);
}
