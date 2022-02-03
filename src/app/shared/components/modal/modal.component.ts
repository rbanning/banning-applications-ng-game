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

  @Output()
  dismissed = new EventEmitter<boolean>();

  @HostBinding('class.open') get showModal() { return this.open; }
  @HostBinding('class.backdrop') get showBackdrop() { return this.backdrop; }

  constructor() { }

  ngOnInit(): void {
  }

  close() {
    this.open = false;
    this.dismissed.next(true);
  }
}
