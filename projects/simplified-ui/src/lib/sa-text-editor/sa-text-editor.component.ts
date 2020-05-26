import { Component,  HostBinding,  ChangeDetectionStrategy } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { _MatQuillBase } from './sa-text-quill-base'

// Increasing integer for generating unique ids for mat-quill components.
let nextUniqueId = 0


@Component({
  selector: 'sa-text-editor',
  host: {
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  },
  templateUrl: './sa-text-editor.component.html',
  styleUrls: ['./sa-text-editor.component.scss'],
  providers: [{ provide: MatFormFieldControl, useExisting: SaTextEditorComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaTextEditorComponent extends  _MatQuillBase {

  controlType = 'sa-text-editor';
  @HostBinding() id = `sa-text-editor-${nextUniqueId++}`

}
