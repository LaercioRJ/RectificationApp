import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class AppComponent {
  title = 'rectification-app';

  constructor(private router: Router) {}

  goToFirstPage(): void {
    this.router.navigateByUrl('');
  }

}
