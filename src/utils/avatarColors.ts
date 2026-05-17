import { lightColors } from '../theme/colors';

export const AVATAR_PALETTE_KEYS: (keyof typeof lightColors)[] = [
  'avatarColor0', 'avatarColor1', 'avatarColor2', 'avatarColor3', 'avatarColor4',
  'avatarColor5', 'avatarColor6', 'avatarColor7', 'avatarColor8', 'avatarColor9',
];

export function getAvatarColorByIndex(index: number, colors: typeof lightColors): string {
  return colors[AVATAR_PALETTE_KEYS[index % AVATAR_PALETTE_KEYS.length]] as string;
}

export function getAvatarColorByName(name: string, colors: typeof lightColors): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return getAvatarColorByIndex(hash, colors);
}

export function getAvatarColorByKey(key: string, colors: typeof lightColors): string {
  return (colors as Record<string, string>)[key] ?? '#888888';
}

export function getDefaultColorKeyByIndex(index: number): string {
  return AVATAR_PALETTE_KEYS[index % AVATAR_PALETTE_KEYS.length] as string;
}

export function getDefaultColorKeyByName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return getDefaultColorKeyByIndex(hash);
}
