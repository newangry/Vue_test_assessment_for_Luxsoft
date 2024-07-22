declare module 'nspell' {
    interface NSpell {
      spell(text: string): boolean;
      suggest(text: string): string[];
      correct(text: string): boolean;
    }
  
    function nspell(aff: string, dic: string): NSpell;
  
    export = nspell;
  }
  