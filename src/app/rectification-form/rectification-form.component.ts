import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rectification-form',
  templateUrl: './rectification-form.component.html',
  styleUrls: ['./rectification-form.component.css']
})
export class RectificationFormComponent implements OnInit {

  constructor() { }

  kernelSizes: string[] = ['3x3', '5x5', '7x7', '9x9', '11x11'];
  selectedKernelSize = '3x3';
  kernelFormats: string[] = ['Retangular', 'Elipse', 'Cruz'];
  selectedKernelFormat = 'Retangular';
  rectificationMethods: string[] = ['Mediana', 'Aberto', 'Fechado', 'Aberto e Fechado'];
  selectedRectificationMethod = 'Mediana';
  iterations: number[] = [1, 2, 3, 4, 5, 6];
  selectedIteration = 1;

  ngOnInit(): void {
  }

}
