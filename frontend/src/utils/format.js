const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatCurrency(value) {
  const amount = Number(value ?? 0);
  return Number.isFinite(amount) ? currency.format(amount) : currency.format(0);
}

export function formatTimeLeft(endTime, now = new Date()) {
  if (!endTime) return 'No end time';

  const remaining = new Date(endTime).getTime() - now.getTime();
  if (remaining <= 0) return 'Ended';

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
