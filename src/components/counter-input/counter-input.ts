import { Component, Input, forwardRef, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'
@Component({
  selector: 'counter-input',
  templateUrl: 'counter-input.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CounterInputComponent),
    multi: true
  }]
})
export class CounterInputComponent implements ControlValueAccessor {

  @Input() counterValue: number = 0;
  @Output() total = new EventEmitter();

  private propagateChange: any = {};
  increment() {
    if (!isNaN(this.counterValue)) {
      this.counterValue++;
      if (this.counterValue < 0) {
        this.counterValue = 0;
      }
    } else { this.counterValue = 0; }
    this.propagateChange(this.counterValue);
    this.totalClick();
  }
  decrement() {
    if (!isNaN(this.counterValue)) {
      this.counterValue--;
      if (this.counterValue < 0) {
        this.counterValue = 0;
      }
    } else { this.counterValue = 0; }
    this.propagateChange(this.counterValue);
    this.totalClick();
  }

  keyup() {
    if (!isNaN(this.counterValue)) {
      if (this.counterValue < 0) {
        this.counterValue = 0;
      }
    } else { this.counterValue = 0; }
    this.propagateChange(this.counterValue);
    this.totalClick();
  }

  totalClick() {
    this.total.emit(
      {
        from: this.counterValue
      }
    )
  }

  writeValue(val: number): void {
    if (val) {
      this.counterValue = val;
    }
  }
  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

}
