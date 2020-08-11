import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { _MatQuillBase } from './sa-text-quill-base';

// Increasing integer for generating unique ids for mat-quill components.
let nextUniqueId = 0;

const SELECTOR = 'sa-text-editor';
@Component({
  selector: SELECTOR,
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  },
  templateUrl: './sa-text-editor.component.html',
  styleUrls: ['./sa-text-editor.component.scss'],
  inputs: ['disabled'],
  providers: [{ provide: MatFormFieldControl, useExisting: SaTextEditorComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaTextEditorComponent extends _MatQuillBase {
  controlType = SELECTOR;
  @HostBinding() id = `${SELECTOR}-${nextUniqueId++}`;

  static ngAcceptInputType_disabled: boolean | string | null | undefined;
  static ngAcceptInputType_required: boolean | string | null | undefined;
}
