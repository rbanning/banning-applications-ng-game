import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGamePhoto, PhotoSize } from '@app/shared/models';

const defaultFallback = 'https://picsum.photos/';
@Component({
  selector: 'app-game-photo',
  templateUrl: './game-photo.component.html',
  styleUrls: ['./game-photo.component.css']
})
export class GamePhotoComponent implements OnInit {
  @Input()
  photo: IGamePhoto | null = null;

  @Input()
  size: PhotoSize = 'thumb';

  @Input()
  square: boolean = false;

  @Input()
  fallback: string = defaultFallback;

  @Input()
  detailed: boolean = false;

  @Output()
  tap = new EventEmitter<IGamePhoto>();

  get sizedFallback() {
    if (this.fallback === defaultFallback) {
      let extra = '';
      switch(this.size) {
        case 'full':
          extra = '2080';
          break;
        case 'regular':
          extra = '1080';
          break;
        case 'small':
          extra = '400';
          break;
        case 'thumb':
          extra = '200';
          break;
      }
    }
    //else
    return this.fallback;
  }

  private defaultPhoto = 'abc';
  get src(): string {
    if (this.photo && this.photo.urls) {
      let [url, params] = (this.photo.urls[this.size] || '').split('?');
      if (params) {
        let query = params.split("&")
                .reduce((prev: any, param: string) => {
                  const [key, value] = param.split('=');
                  prev[key] = value;
                  return prev;
                }, {});
        if (this.square) {
          //fit=fillmax&fill=blur
          query = {
            ...query,
            fit: "fillmax",
            fill: 'blur',
            h: query.w
          };          
        }
        url += '?' + Object.keys(query).map(key => `${encodeURI(key)}=${encodeURI(query[key])}`).join('&');
      }
      return url;
    }
    //else
    return this.defaultPhoto;
  }

  constructor() { }

  ngOnInit(): void {
  }

  handleClick(event: MouseEvent) {
    if (this.photo) {
      this.tap.emit(this.photo);
    }
  }

}
