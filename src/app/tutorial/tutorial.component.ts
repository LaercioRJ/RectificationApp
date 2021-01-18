import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper, MatStepperIcon } from '@angular/material/stepper';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent implements OnInit {

  selectedImage = '.txt';
  imageOptions: string[] = ['.txt', '.csv'];

  constructor(private tutorialDialog: MatDialogRef<TutorialComponent>) { }

  ngOnInit(): void {
  }

  closeDialog(): void {
    this.tutorialDialog.close();
  }

  goPreviousStep(stepper: MatStepper): void {
    stepper.previous();
  }

  goNextStep(stepper: MatStepper): void {
    stepper.next();
  }

}
