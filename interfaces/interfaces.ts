export interface UserDocument {
  id: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  avatar: string;
  token?: string;
  isActive: number;
}

export interface UsersData {
  id: number;
  avatar: File;
  name: string;
  email: string;
  role: string;
}

export interface Users {
  users: UsersData[];
}

export interface TopicsData {
  id: number;
  alias: string;
  title: string;
}

export interface LevelsData {
  id: number;
  alias: string;
  title: string;
}

export interface LanguagesData {
  id: number;
  alias: string;
  title: string;
  code: string;
  isActive: number;
}

export interface WordsData {
  id: number;
  alias: string;
  title: string;
  transcription: string;
  description: string;
  prem_description: string;
  is_phrase: boolean;
  is_active: boolean;
  image: string;
  level_id: number;
  level: LevelsData;
  topic_id: number;
  language_id: number;
  language: LanguagesData;
  isClicked?: boolean;
  t_words: any;
}
