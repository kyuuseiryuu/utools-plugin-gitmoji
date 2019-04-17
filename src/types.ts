export interface Gitmoji {
  emoji: string;
  entity: string;
  code: string;
  description: string;
  name: string;
}

export interface GitmojiData {
  gitmojis: Gitmoji[];
}
