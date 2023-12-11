import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, BehaviorSubject, of } from 'rxjs';
import { delay, finalize, takeUntil, tap } from 'rxjs/operators';

import { FileDragAndDropState } from '@ironsource/fusion-ui/components/file-drag-and-drop';
import { FileCsvUploadModule } from '@ironsource/fusion-ui/components/file-csv-upload';

@Component({
  selector: 'fusion-story-wrapper',
  template: `
  <div style="width: 620px; height: 196px; display: block">
      <fusion-file-csv-upload
          [loading]="fileInUpload$ | async"
          [disabled]="fileUploadDisabled$ | async"
          [fileState]="fileState$ | async"
          (handleFiles)="onFilesSelected($event)"
          (deleteFile)="onFileDelete($event)"
      ></fusion-file-csv-upload>
  </div>
  `,
  standalone: true,
  imports: [CommonModule, FileCsvUploadModule],
})
export class FusionStoryWrapperComponent implements OnDestroy {
  fileInUpload$ = new BehaviorSubject(false);
  fileUploadDisabled$ = new BehaviorSubject(false);
  // @ts-ignore
  fileState$ = new BehaviorSubject<FileDragAndDropState>(null);

  private onDestroy$ = new Subject<void>();

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  onFilesSelected(files: FileList) {
    of(files.item(0))
      .pipe(
        // @ts-ignore
        takeUntil(this.onDestroy$),
        tap((file: File) => {
          this.fileInUpload$.next(true);
          this.fileState$.next({ name: file.name });
        }),
        delay(2000),
        finalize(() => {
          this.fileInUpload$.next(false);
        })
      )
      .subscribe(
        (file: File) => {
          this.fileState$.next({ name: file.name, state: 'success' });
        },
        (error) => {
          this.fileState$.next({
            ...this.fileState$.getValue(),
            state: 'error',
            message: error.errorMessage,
          });
        }
      );
  }

  onFileDelete($fileName: string) {
    this.fileInUpload$.next(true);
    setTimeout((_: unknown) => {
      this.fileInUpload$.next(false);
    }, 1000);
  }
}
