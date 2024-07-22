// src/types.ts
export interface Country {
    name: {
      common: string;
      nativeName: Record<string, { official: string; common: string }>;
    };
    flags: {
      png: string;
      svg: string;
    };
    population: number;
    region: string;
    subregion: string;
    capital: string[];
    borders?: string[]; // Add this line
  }
  