import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements OnInit {

  formControl: FormControl = new FormControl('',[Validators.required]);

  constructor() { }

  ngOnInit(): void {}

  toggleState() {
    this.formControl.disabled ? this.formControl.enable() : this.formControl.disable();
  }

  reset(){
    this.formControl.setValue('');
  }

}

