import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.css']
})
export class GradientComponent implements OnInit {

  constructor(private gradientDialogReference: MatDialogRef<GradientComponent>,
              @Inject(MAT_DIALOG_DATA) public data) { }

  colorValues = [
    [ this.data.classColors[0][0], this.data.classColors[0][1], this.data.classColors[0][2] ],
    [ this.data.classColors[1][0], this.data.classColors[1][1], this.data.classColors[1][2] ],
    [ this.data.classColors[2][0], this.data.classColors[2][1], this.data.classColors[2][2] ],
    [ this.data.classColors[3][0], this.data.classColors[3][1], this.data.classColors[3][2] ],
    [ this.data.classColors[4][0], this.data.classColors[4][1], this.data.classColors[4][2] ],
    [ this.data.classColors[5][0], this.data.classColors[5][1], this.data.classColors[5][2] ],
    [ this.data.classColors[6][0], this.data.classColors[6][1], this.data.classColors[6][2] ]
  ];

  ngOnInit(): void {
    this.initializeGradientExample();
  }

  initializeGradientExample(): void {
    if (this.colorValues[6][0] !== 0) {
      this.applyGradient('red');
      return;
    }
    if (this.colorValues[6][1] !== 0) {
      this.applyGradient('green');
      return;
    }
    if (this.colorValues[6][2] !== 0) {
      this.applyGradient('blue');
      return;
    }
    this.applyGradient('gray');
  }

  applyGradient(selectedOption: string): void {
    switch (selectedOption) {
      case 'red':
        this.setGradientExampleColor([120, 0, 0], [33, 0, 0]);
        this.colorValues[6] = [255, 0, 0];
        break;
      case 'green':
        this.setGradientExampleColor([0, 120, 0], [0, 33, 0]);
        this.colorValues[6] = [0, 255, 0];
        break;
      case 'blue':
        this.setGradientExampleColor([0, 0, 120], [0, 0, 33]);
        this.colorValues[6] = [0, 0, 255];
        break;
      case 'gray':
        this.setGradientExampleColor([0, 0, 0], [63, 63, 63]);
        document.getElementById('gradientExample2').style.background = 'rgb(75, 75, 75)';
        document.getElementById('gradientExample5').style.background = 'rgb(220, 220, 220)';
        this.colorValues[1] = [75, 75, 75];
        this.colorValues[4] = [220, 220, 220];
        this.colorValues[6] = [0, 0, 0];
        break;
    }
  }

  setGradientExampleColor(rgbCodeBase: number[], rgbCodeIncrement: number[]): void {
    for (let i = 0; i < 5; i++) {
      this.colorValues[i] = [(rgbCodeBase[0] + (rgbCodeIncrement[0] * i)), (rgbCodeBase[1] + (rgbCodeIncrement[1] * i)),
        (rgbCodeBase[2] + (rgbCodeIncrement[2] * i))];
      document.getElementById('gradientExample'.concat(String(i + 1))).style.background = 'rgb(' + String(this.colorValues[i][0]) +
        ', ' + String(this.colorValues[i][1]) + ', ' + String(this.colorValues[i][2]) + ')';
    }
  }

  closeDialogCancelChanges(): void {
    this.gradientDialogReference.close();
  }

  closeDialogApplyChanges(): void {
    this.gradientDialogReference.close({
      data: this.colorValues
    });
  }
}
