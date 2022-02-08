import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, map, catchError, of, tap, forkJoin } from "rxjs";

import { randomElementFromArray, stringCompare } from "@app/shared/common";
import { ILetterWordGame, LetterWordGame } from "@app/shared/models";

interface IWordListResult {
  words: string[] | null,
  ref: string[] | null
}

@Injectable()
export class LetterWordGameService {

  constructor(private http: HttpClient) 
  { }

  buildGame(size: number): Observable<ILetterWordGame | null> {
    return this.wordRepo(size)
      .pipe(
        tap(lists => console.log("DEBUG: the list", {lists})),
        map(lists => {
          if (lists?.words && lists?.ref) {

            //check
            const missing = lists.words.filter(word => {
              return !lists.ref?.includes(word.toLocaleLowerCase());
            });
            console.log("DEBUG: CHECKING: ", {missing});

            const word = randomElementFromArray(lists.words);
            if (word) {
              return new LetterWordGame(word, lists.ref);
            }
          }
          //else
          return null;
        })
      );
  }

  private wordRepo(size: number): Observable<IWordListResult | null> {
    const urlWords = `assets/data/word-list.txt`;
    const urlRef = `assets/data/word-ref.txt`;
    const requests = [
      this.http.get(urlWords, {responseType: 'text'}),
      this.http.get(urlRef, {responseType: 'text'})
    ];

    const fn = ([a, b]: [string, string]) => {
      console.log(a,b);
    }

    return forkJoin(requests)
      .pipe(
        map((resp) => {
          //expect resp to have two results
          if (resp.length === 2) {
            return {
              words: this.parseAndClean(resp[0], size),
              ref: this.parseAndClean(resp[1], size)
            } as IWordListResult;  
          }
          //else
          return null;
        }),
        catchError(err => {
          console.warn("DEBUG: could not get requested word repo", {size, err});
          return of(null);  //
        })
      )
  }

  private parseAndClean(result: string, size: number): string[] {
    return result.split('\n')
    .map(m => m?.trim())
    .filter(m => m?.length === size);
  }
}
