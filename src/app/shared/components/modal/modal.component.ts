import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  @Input()
  title?: string;

  @Input()
  open: boolean = false;

  @Input()
  backdrop: boolean = true;

  @Input()
  backdropOpaque: boolean = true;

  @Output()
  dismissed = new EventEmitter<boolean>();

  @HostBinding('class.open') get showModal() { return this.open; }
  @HostBinding('class.backdrop') get showBackdrop() { return this.backdrop; }
  @HostBinding('class.backdropOpaque') get showBackdropOpaque() { return this.backdropOpaque; }

  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.open = false;
    this.dismissed.next(true);
  }
}
