import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpinnerService } from './services/spinner.service';
import { LoadingService } from './services/loading.service';
import { Observable, from, Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { OverlayComponent } from './overlay/overlay.component';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    private count = 0;
    constructor(private readonly spinnerOverlayService: SpinnerService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const spinnerSubscription: Subscription = this.spinnerOverlayService.spinner$.subscribe();
      return next.handle(req).pipe(finalize(() => spinnerSubscription.unsubscribe()));
    }
}
