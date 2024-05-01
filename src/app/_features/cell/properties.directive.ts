import { Directive, ElementRef, Renderer2, effect, inject, input } from '@angular/core';
import { CellProperties, FontWeight } from '../../_interfaces/cell-properties';

@Directive({
  selector: '[cellProperties]',
  standalone: true
})
export class PropertiesDirective {
  readonly cellProperties = input.required<Partial<CellProperties>>();
  readonly elementRef = inject(ElementRef);
  readonly renderer = inject(Renderer2);
  readonly applyStyles = effect(() => {
    const { fontWeight, backgroundColor } = this.cellProperties();
    this.renderer.setStyle(this.elementRef.nativeElement, 'font-weight', fontWeight === FontWeight.BOLD ? 'bold' : 'unset');
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', backgroundColor ?? 'unset');
  });
}
