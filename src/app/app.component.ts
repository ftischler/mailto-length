import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeWhile } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('testLink') testLink: ElementRef;
  public mailtoForm = new FormGroup({
    recipient: new FormControl('', Validators.email),
    subject: new FormControl(''),
    mailbody: new FormControl('')
  });

  private alive = true;

  public mailtoUrl$: Observable<string>;

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.mailtoUrl$ = this.mailtoForm.valueChanges.pipe(
      filter(() => this.mailtoForm.valid),
      debounceTime(200),
      distinctUntilChanged(),
      map(this.tranformToUrl),
      startWith('mailto:'),
      takeWhile(() => this.alive)
    );
  }

  ngOnDestroy() {
    this.alive = false;
  }

  public onTestUrl(): void {
    this.testLink.nativeElement.click();
  }

  public onCopy(target: HTMLTextAreaElement): void {
    target.select();
    document.execCommand('copy');
    this.snackBar.open('Text has been copied to clipboard', 'CLOSE', {
      duration: 2000
    });
  }

  private tranformToUrl({recipient, subject, mailbody}: {recipient: string, subject: string, mailbody: string}): string {
    const subjectPart = subject ? `subject=${subject}` : '';
    const mailbodyPart = mailbody ? `body=${mailbody}` : '';
    const queryPart = recipient && subjectPart || mailbodyPart ? '?' : '';
    const concatPart = subject && mailbodyPart ? '&' : '';
    return encodeURI(`mailto:${recipient}${queryPart}${subjectPart}${concatPart}${mailbodyPart}`);
  }
}
