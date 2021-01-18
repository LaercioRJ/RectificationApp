import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';

import { TutorialComponent } from '../tutorial/tutorial.component';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class AppComponent {
  title = 'rectification-app';

  constructor(private matDialog: MatDialog,
              private router: Router) {}

  goToFirstPage(): void {
    this.router.navigateByUrl('');
  }

  openTutorial(): void {
    const tutorialDialogRef = this.matDialog.open(TutorialComponent, {
      width: '49vw',
      height: '44vw',
    });
  }

  returnHomePage(): void {
    this.router.navigateByUrl('');
  }

}
