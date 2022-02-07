import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, Observable, switchMap, throwError } from 'rxjs';

import { BannAppsUnsplashService, ISearchResult, ToastService, UnsplashService } from '@app/core/services';
import { httpErrorToString, parseHttpError, processHttpResponse } from '@app/shared/common';
import { IGamePhoto, IPatchDto, PatchDto } from '@app/shared/models';

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
    private unsplashService: UnsplashService,
    private bannapps: BannAppsUnsplashService,
    private toastService: ToastService
  ) { 
    this.working$ = this.bannapps.combineWorking$(unsplashService.working$());
    this.selected$ = this.selectedSubject.asObservable();
  }

  ngOnInit(): void {
  }

  addToImpact(input: string) {
    const ids = input.split(",").map(m => m.trim()).filter(Boolean);
    console.log("DEBUG: ids", ids);
    if (ids.length > 0) {
      const patch = PatchDto.Create('add', '/topics', 'Community Photo of the Year');
      const actions: Observable<IGamePhoto>[] = [];
      ids.forEach(id => {
        actions.push(this.bannapps.patchPhoto(id, patch));
      });
      forkJoin(actions)
        .subscribe({
          next: (results) => {
            console.log("SUCCESS updated photos", {patch, ids, results});
            this.toastService.addAs('success', `Updated ${results.length} of ${ids.length} photos`);
          },
          error: (err) => {
            const httpErr = parseHttpError(err);
            console.warn("FAILED: unable to update photos", {err, httpErr, ids, patch});
            this.toastService.addAs('error', httpErrorToString(httpErr) || 'Unable to update photos');
          }
        })
    }
  }
  process(input: string) {
    const ids = input.split(",").map(m => m.trim()).filter(Boolean);
    console.log("DEBUG: ids", ids);
    if (ids.length > 0) {
      ids.forEach(id => {
        this.updateFields(id, ['alt', 'blurHash']); 
      });
    }
  }
  updateFields(id: string, fields: (keyof IGamePhoto)[]) {
    this.unsplashService.getPhoto(id)
      .subscribe({
        next: (photo: IGamePhoto) => {
          const patches: IPatchDto[] = fields.map(key => {
            return PatchDto.Create('replace', `/${key}`, photo[key] as string);
          });
          this.bannapps.patchPhoto(id, patches)
            .subscribe({
              next: (result: IGamePhoto) => {
                console.log("DEBUG: Updated Photo", {photo, result, patches});
                this.toastService.addAs('success', `Updated ${id}`);
              },
              error: (err) => {
                const httpErr = parseHttpError(err);
                console.warn("FAILED: unable to update photo", {err, httpErr, patches});
                this.toastService.addAs('error', httpErrorToString(httpErr) || 'Unable to update photo');
              }
            })
        }
      })
  }

  getPhotoJsonAndPost(id: string, category?: string, yearString?: string) {
    this.unsplashService.getPhotoRaw(id.trim())
      .subscribe({
        next: (data: any) => {
          this.post(data, category, yearString);
        },
        error: (err) => {
          const resp = parseHttpError(err);
          console.warn("FAIL - getting raw photo json", {err, resp});
          this.toastService.addAs('error', 
            httpErrorToString(resp) || 'Could not create photo',
            15);
        }
      })
  }



  post(data: any, category?: string, yearString?: string) {
    if (typeof(data) === 'string') {
      data = JSON.parse(data);
    }
    this.bannapps.addPhotoFromUnsplashObj(data)
      .subscribe({
        next: (result) => {
          const year = parseInt(yearString || 'x'); //force to fail if no yearString
          if (result.id && category && !isNaN(year)) {
            this.bannapps.addAwardWinner(result.id, category, year)
              .subscribe({
                next: (awardPhoto) => {
                  console.log("SUCCESS", {awardPhoto, result, data});
                  this.toastService.addAs('success', `Created Award Photo ${result.id}`);      
                },
                error: this.processError('Create Award')
              })
          } else {
            console.log("SUCCESS", {result,data});
            this.toastService.addAs('success', `Created Photo ${result.id}`);
          }
        },
        error: this.processError('Create Photo')
      });
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

  private processError(action: string) {
    return (err: any) => {
      const resp = parseHttpError(err);
      console.warn("FAIL", {action, err, resp});
      this.toastService.addAs('error', 
        httpErrorToString(resp) || `ERROR: ${action}`,
        15);
    };
  }
}
