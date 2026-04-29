export const formatCurrency = (value: number): string => {
  return `₹ ${value.toFixed(2)}`;
};

export const formatDate = (value: number | Date): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
};

export const getInitials = (value?: string | null): string => {
  if (!value?.trim()) {
    return '?';
  }

  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }

  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('');
};
