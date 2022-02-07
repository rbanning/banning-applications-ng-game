import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { unsplashUrl } from '@app/shared/common';
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
  fit: boolean = false;

  @Input()
  fallback: string = defaultFallback;

  @Input()
  detailed: boolean = false;

  @Input()
  more: boolean = false;

  @Input()
  showWorking: boolean = false;

  @Output()
  tap = new EventEmitter<IGamePhoto>();
  
  showMoreModal: boolean = false;
  working: boolean = false;
  loaded: boolean = false;
  error?: string;

  private defaultPhoto = 'abc';  //todo: what to use for a default photo?
  get src(): string {
    if (this.photo && this.photo.urls) {
      let width: number | null = null;
      if (this.fit) {
        width = Math.floor(document.body.offsetWidth * .7);
      }
      return  unsplashUrl(
        this.photo.urls, 
        this.size, 
        this.square, 
        typeof(width) === 'number' ? width : undefined);
    }
    //else
    return this.defaultPhoto;
  }

  constructor() { }

  ngOnInit(): void {
    this.error = undefined;

    //do we want to show the "working" bar?
    if (this.showWorking) {
      this.working = true;
      this.loaded = false;
      this.loadImage();
    } else {
      this.working = false;
      this.loaded = true;
    }
  }

  private loadImage() {
    if (this.photo) {
      const img = new Image();
      img.onload = () => { 
        this.working = false; 
        this.loaded = true; 
      }
      img.onerror = (err) => {
        this.working = false; 
        this.error = "Unable to find the image";
      }
      img.src = this.src;  
    }
    return !!this.photo;
  }

  handleClick(event: MouseEvent) {
    if (this.photo) {
      this.tap.emit(this.photo);
    }
  }

}
