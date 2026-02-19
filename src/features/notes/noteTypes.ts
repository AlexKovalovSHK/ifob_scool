export interface Translation {
  ru: string;
  en?: string;      // Optional as not all entries have English translations
  de?: string;      // Optional as not all entries have German translations
  ro?: string;      // Optional as not all entries have Romanian translations
}

export interface Instrument {
  id: number;
  translations: Translation;
}

export interface Vocal {
  id: number;
  translations: Translation;
}

export interface Topic {
  id: number;
  translations: Translation;
}

export interface Composer {
  id: number;
  name: string;
}

export interface Arranger {
  id: number;
  name: string;
}

export interface Orchestrator {
  id: number;
  name: string;
}

export interface Translator {
  id: number;
  name: string;
}

export interface Thumbnail {
  sequence: number;
  code: string;
  type: string;
  size: number;
  extension: string;
}

export interface File {
  id: number;
  name: string;
  code: string;
  size: number;
  extension: string;
  primary: boolean;
  thumbnails: Thumbnail[];
}

export interface Song {
  id: number;
  code: string;
  translations: Translation;
  difficulty: 'easy' | 'medium' | 'hard';  // Union type based on observed values
  instruments: Instrument[];
  vocals: Vocal[];
  topics: Topic[];
  composers: Composer[];
  arrangers: Arranger[];
  orchestrators: Orchestrator[];
  translators: Translator[];
  createdAt: string;  // Date string in format YYYY-MM-DD
  createdBy?: string; // Optional as not all entries have this field
  updatedBy?: string; // Optional as not all entries have this field
  files: File[];
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface NoteListContent {
  content: Song[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}