import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private breakpointObserver = inject(BreakpointObserver);
  isSmallScreen$ = this.breakpointObserver.observe([Breakpoints.XSmall])

  constructor() {}

 
}
