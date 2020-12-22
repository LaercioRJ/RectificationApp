import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class MessageDeliveryService {

  constructor(private snackBar: MatSnackBar) { }

  showTimedMessage(message: string, timeOnScreen: number): void {
    this.snackBar.open(message, '', {
      duration: timeOnScreen,
      verticalPosition: 'top'
    });
  }
}
