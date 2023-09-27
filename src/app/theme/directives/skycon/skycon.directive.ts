import { Directive, ElementRef, Input } from '@angular/core';

@Directive ({

})

export class Skycon {
  $el: any;
  @Input() color: string;
  @Input() weather: string;

  constructor(el: ElementRef) {
  }

  ngOnInit(): void {
  }
}
