export const AVATAR_TEMPLATES = [
  { id: '1', label: 'Dealer', emoji: '🤵', color: 'bg-nb-secondary' },
  { id: '2', label: 'High Roller', emoji: '🕶️', color: 'bg-nb-primary' },
  { id: '3', label: 'Lucky Seven', emoji: '💎', color: 'bg-nb-tertiary' },
  { id: '4', label: 'Jackpot', emoji: '🎰', color: 'bg-nb-secondary' },
  { id: '5', label: 'Ace', emoji: '🔥', color: 'bg-nb-primary' },
];

export function getAvatarById(id: string) {
  return AVATAR_TEMPLATES.find((a) => a.id === id) || AVATAR_TEMPLATES[0];
}
