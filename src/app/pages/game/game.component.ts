import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';

import { ISearchResult, UnsplashService } from '@app/core/services';
import { httpErrorToString, parseHttpError } from '@app/shared/common';
import { IGamePhoto } from './components/models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  working$: Observable<boolean>;
  results$?: Observable<ISearchResult>;
  error: string | null = null;

  private selectedSubject = new BehaviorSubject<IGamePhoto | null>(null);
  selected$: Observable<IGamePhoto | null>;

  constructor(
    private unsplashService: UnsplashService
  ) { 
    this.working$ = unsplashService.working$();
    this.selected$ = this.selectedSubject.asObservable();
  }

  ngOnInit(): void {
  }

  search(query: string) {
    this.error = null;
    this.results$ = this.unsplashService.search(query, null, 'squarish')
      .pipe(
        catchError((err: any) => {
          const resp = parseHttpError(err);
          console.warn("Error searching", {err, resp});
          this.error = httpErrorToString(resp);
          return throwError(() => resp);
        })
      );
  }

  showDetails(photo: IGamePhoto) {
    this.selectedSubject.next(photo);
    console.log("DEBUG: selected", {photo});
  }
  hideDetails() {
    this.selectedSubject.next(null);
  }
}
