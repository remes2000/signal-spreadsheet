import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { Injectable, TemplateRef, ViewContainerRef, inject } from "@angular/core";
import { Subject, filter, fromEvent, take, takeUntil } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ContextMenuService {
  readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef = null;
  private readonly closeSubject$ = new Subject<void>();

  open(
    template: TemplateRef<unknown>,
    viewContainerRef: ViewContainerRef,
    { x, y }: MouseEvent
  ) {
    this.close();
    this.overlayRef = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo({ x, y })
        .withPositions([
          {
            originX: 'end',
            originY: 'bottom',
            overlayX: 'end',
            overlayY: 'top',
          },
        ])
    });
    this.overlayRef.attach(new TemplatePortal(template, viewContainerRef));
    this.subscribeToKeyboardEvents();
    this.subscribeToMouseEvents();
  }

  close() {
    this.overlayRef?.dispose();
    this.closeSubject$.next();
    this.overlayRef = null;
  }

  private subscribeToKeyboardEvents(): void {
    fromEvent<KeyboardEvent>(document, 'keydown')
      .pipe(
        filter((event) => event.key === 'Escape'),
        take(1),
        takeUntil(this.closeSubject$)
      )
      .subscribe(() => this.close());
  }

  private subscribeToMouseEvents(): void {
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter((event) => !this.overlayRef.overlayElement.contains(event.target as HTMLElement)),
        take(1),
        takeUntil(this.closeSubject$)
      )
      .subscribe(() => this.close());
  }
}