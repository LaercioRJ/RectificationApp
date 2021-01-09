import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-per-class-customization',
  templateUrl: './per-class-customization.component.html',
  styleUrls: ['./per-class-customization.component.css']
})
export class PerClassCustomizationComponent implements OnInit {

  constructor(private perClassCustomizationDialogReference: MatDialogRef<PerClassCustomizationComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  classNumber: number = this.data.classNumber;
  redRgbValue = '';
  greenRgbValue = '';
  blueRgbValue = '';
  redSliderValue = 0;
  greenSliderValue = 0;
  blueSliderValue = 0;
  newValues = [ this.data.classColor[0], this.data.classColor[1], this.data.classColor[2] ];

  ngOnInit(): void {
    this.alterSelectedColor();
  }

  alterSelectedColor(): void {
    const red = this.newValues[0];
    const green = this.newValues[1];
    const blue = this.newValues[2];
    this.redSliderValue = red;
    this.greenSliderValue = green;
    this.blueSliderValue = blue;
    this.redRgbValue = red.toString();
    this.greenRgbValue = green.toString();
    this.blueRgbValue = blue.toString();

    document.getElementById('rectangleColorExample').style.background = 'rgb(' + red.toString() + ', ' +  green.toString()
      + ', ' + blue.toString() + ')';
  }

  alterClassColor(redLevel: number, greenLevel: number, blueLevel: number): void {
    this.newValues[0] = redLevel;
    this.newValues[1] = greenLevel;
    this.newValues[2] = blueLevel;
    this.alterSelectedColor();
  }

  changeRgbSlidersValue(event: any, sliderId: number): void {
    if (sliderId === 0) {
      this.alterClassColor(event.value, parseInt(this.greenRgbValue, 10), parseInt(this.blueRgbValue, 10));
    }
    if (sliderId === 1) {
      this.alterClassColor(parseInt(this.redRgbValue, 10), event.value, parseInt(this.blueRgbValue, 10));
    }
    if (sliderId === 2) {
      this.alterClassColor(parseInt(this.redRgbValue, 10), parseInt(this.greenRgbValue, 10), event.value);
    }
  }

  closeDialogCancelChanges(): void {
    this.perClassCustomizationDialogReference.close();
  }

  closeDialogApplyChanges(): void {
    this.perClassCustomizationDialogReference.close({
      data: this.newValues
    });
  }

}
