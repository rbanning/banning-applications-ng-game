import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

export enum KEY_CODE {
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  ESC = 'Escape',
  RETURN = 'Enter'
}

export type PopupMenuTheme = "primary" | "accent" | "light" | "none";


export type IPopMenuItemFn = (item: IPopMenuItem) => void;

export interface IPopMenuItem {
  id?: string;
  text: string;
  action: string /* href */ 
    | string[] /* routerlink */
    | IPopMenuItemFn;
  deactivate?: boolean;
}
export interface IPopMenuItemEnhanced extends IPopMenuItem {
  routerLink?: string[];
  href?: string;
  fn?: IPopMenuItemFn
}

@Component({
  selector: 'app-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrls: ['./popup-menu.component.css']
})
export class PopupMenuComponent implements OnInit {
  @Input()
  title: string = "";

  @Input()
  items: IPopMenuItem[] = [];

  get itemsEnhanced(): IPopMenuItemEnhanced[] {
    return (this.items || [])
      .map(item => {
        const ret: IPopMenuItemEnhanced = {
          ...item,
          href: typeof(item.action) === 'string' ? item.action : undefined,
          routerLink: Array.isArray(item.action) ? item.action : undefined,
          fn: typeof(item.action) === 'function' ? item.action : undefined,
        };
        ret.deactivate = ret.deactivate || (!ret.href && !ret.routerLink && !ret.fn);
        return ret;
      });
  }
  @Input()
  visible: boolean = false;

  @Input()
  selected: number = 0;

  @Input()
  theme: PopupMenuTheme = "none";

  @Input()
  width: number = 300;

  @Input()
  deltaX: number = 0;

  @Input()
  deltaY: number = 0;

  @Output()
  activated = new EventEmitter<IPopMenuItemEnhanced>();

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (!this.visible) { return; }

    switch(event.code) {
      case KEY_CODE.DOWN_ARROW:
        this.selected = Math.min(this.selected + 1, this.items.length - 1);
        event.preventDefault();
        break;
      case KEY_CODE.UP_ARROW:
        this.selected = Math.max(this.selected - 1, 0);
        event.preventDefault();
        break;
      case KEY_CODE.RETURN:
        if (this.selected >= 0 && this.selected < this.items.length) {
          this.act(this.itemsEnhanced[this.selected]);
          event.preventDefault();
        }
        console.log("TODO: perform the selected item's action", { selected: this.selected, item: this.items[this.selected]});
        break;
      case KEY_CODE.ESC:
        this.visible = false;
        event.preventDefault();
        break;
    }
  }

  @HostBinding('class') get css() { 
    return `${this.theme} ${this.visible ? 'visible' : ''}`; 
  }
  @HostBinding('style.transform') get transform() { 
    return `translate(${this.deltaX}px, ${this.deltaY}px`; 
  }
  @HostBinding('style.maxWith') get maxWidth() { 
    return `${this.width}px`; 
  }

  @HostBinding('style.top') get topPx() { 
    return `${this.top}px`; 
  }

  @HostBinding('style.left') get leftPx() { 
    return this.left === null ? 'auto' : `${this.left}px`; 
  }
  @HostBinding('style.right') get rightPx() { 
    return this.right === null ? 'auto' : `${this.right}px`; 
  }

  private top: number = 0;
  private left: number | null = 0;
  private right: number | null = null;

  constructor(
    private elementRef: ElementRef,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  act(item: IPopMenuItemEnhanced) {
    this.close();
    this.activated.next(item);

    if (item?.href) { 
      window.location.href = item.href;
    } else if (item?.routerLink) {
      this.router.navigate(item.routerLink);
    } else if (item?.fn) {
      item.fn(item);
    }
  }
  open(event: MouseEvent) {
    this.top = event.y;
    this.right = null;
    
    //NOTE: this.elementRef.nativeElement.offsetWidth is 0 because element is not visible
    this.left = Math.max(event.x - this.elementRef.nativeElement.offsetWidth, 0);
    
    if (this.left + this.width > window.document.body.offsetWidth) {
      this.left = null;
      this.right = 5;
    }
    this.toggle(true);
  }

  toggle(show: boolean | null = null) {
    this.visible = typeof(show) === 'boolean' ? show : !this.visible;
  }

  close() {
    this.toggle(false);
  }
}
