import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alert, AlertService } from '@hmcts/ccd-case-ui-toolkit';
import { select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'exui-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit, OnDestroy {
  public alertMessage = '';
  public alertLevel = '';
  public successMessage = '';
  public errorMessage = '';
  public warningMessage = '';

  public alertMessageSubscription: Subscription;
  public successMessageSubscription: Subscription;
  public errorMessageSubscription: Subscription;
  public warningMessageSubscription: Subscription;
  public routeSubscription: Subscription;

  private alertMessageObservable: Observable<Alert>;
  private successMessageObservable: Observable<Alert>;
  private errorMessageObservable: Observable<Alert>;
  private warningMessageObservable: Observable<Alert>;

  constructor(
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  public ngOnInit() {
    this.setAlertMessage();
    this.setSuccessMessage();
    this.setErrorMessage();
    this.setWarningMessage();
  }

  public setAlertMessage() {
    this.alertMessageObservable = this.alertService.alerts.pipe(select( alert => alert));
    this.routeSubscription = this.router.events.subscribe(() => this.alertMessage = '');
    this.alertMessageSubscription = this.alertMessageObservable.subscribe(alert => {
      if (alert) {
        this.alertMessage = alert.message;
        this.alertLevel = alert.level;
      }
    });
  }

  public setSuccessMessage() {
    this.successMessageObservable = this.alertService.successes.pipe(select( alert => alert));
    this.routeSubscription = this.router.events.subscribe(() => this.successMessage = '');
    this.successMessageSubscription = this.successMessageObservable.subscribe(alert => {
      if (alert) {
        this.successMessage = alert.message;
      }
    });
  }

  public setErrorMessage() {
    this.errorMessageObservable = this.alertService.errors.pipe(select( alert => alert));
    this.routeSubscription = this.router.events.subscribe(() => this.errorMessage = '');
    this.errorMessageSubscription = this.errorMessageObservable.subscribe(alert => {
      if (alert) {
        this.errorMessage = alert.message;
      }
    });
  }

  public setWarningMessage() {
    this.warningMessageObservable = this.alertService.warnings.pipe(select( alert => alert));
    this.routeSubscription = this.router.events.subscribe(() => this.warningMessage = '');
    this.warningMessageSubscription = this.warningMessageObservable.subscribe(alert => {
      if (alert) {
        this.warningMessage = alert.message;
      }
    });
  }

  public ngOnDestroy() {
    this.alertMessageSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
