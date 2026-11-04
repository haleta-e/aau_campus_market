export function getCategoryEmoji(category: string): string {
  const cat = (category || '').toLowerCase();
  if (cat.includes('elec') || cat.includes('tech') || cat.includes('phone') || cat.includes('usb')) {
    return '⚡';
  }
  if (cat.includes('stat') || cat.includes('pen') || cat.includes('paper')) {
    return '✏️';
  }
  if (cat.includes('book') || cat.includes('text') || cat.includes('note')) {
    return '📚';
  }
  if (cat.includes('cloth') || cat.includes('wear') || cat.includes('shirt') || cat.includes('hoodie')) {
    return '👕';
  }
  if (cat.includes('food') || cat.includes('snack') || cat.includes('drink') || cat.includes('beverage')) {
    return '🥪';
  }
  if (cat.includes('access') || cat.includes('bag') || cat.includes('case')) {
    return '🎒';
  }
  if (cat.includes('sanit') || cat.includes('hygiene') || cat.includes('soap')) {
    return '🧼';
  }
  return '📦';
}

export function getCampusEmoji(campus: string): string {
  const c = (campus || '').toLowerCase();
  if (c.includes('4 kilo')) return '🏛️';
  if (c.includes('5 kilo')) return '🔬';
  if (c.includes('6 kilo')) return '🎓';
  if (c.includes('sefer selam')) return '🏥';
  if (c.includes('mexico')) return '💼';
  if (c.includes('ledeta')) return '⚖️';
  return '📍';
}

export function getUserRoleEmoji(role: string): string {
  const r = (role || '').toUpperCase();
  if (r === 'ADMIN') return '👑';
  if (r === 'SELLER') return '🏪';
  return '🎓';
}
