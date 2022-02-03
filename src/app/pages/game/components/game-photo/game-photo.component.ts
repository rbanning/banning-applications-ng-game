import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IGamePhoto, PhotoSize } from '../models';

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
  constructor() { }

  ngOnInit(): void {
  }

  handleClick(event: MouseEvent) {
    if (this.photo) {
      this.tap.emit(this.photo);
    }
  }

}
