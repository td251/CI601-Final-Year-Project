
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { OverlayComponent } from '../overlay/overlay.component';
import { NEVER, defer } from 'rxjs';
import { finalize, share } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  constructor(private overlay: Overlay) { }
  private overlayRef: OverlayRef = undefined;
  public readonly spinner$ = defer(() => {
    this.show();
    return NEVER.pipe(
      finalize(() => {
        this.hide();
      })
    );
  }).pipe(share());
  public show(): void {
    // Hack avoiding `ExpressionChangedAfterItHasBeenCheckedError` error
    Promise.resolve(null).then(() => {
      this.overlayRef = this.overlay.create({
        positionStrategy: this.overlay
          .position()
          .global()
          .centerHorizontally()
          .centerVertically(),
        hasBackdrop: true,
      });
      this.overlayRef.attach(new ComponentPortal(OverlayComponent));
    });
  }

  public async hide(): Promise<void> {


    if (this.overlayRef) {
      this.overlayRef.detach();
      this.overlayRef = undefined;
    }
  }
}
