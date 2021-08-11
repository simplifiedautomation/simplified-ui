import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { SaSelectConfig } from '../../../../projects/simplified-ui/src/lib/models/SaSelectModels';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit {

  formControl: FormControl = new FormControl('',[Validators.required]);
  saSelectConfig: SaSelectConfig<any> = new SaSelectConfig<any>();

  constructor() {
    this.saSelectConfig.options = new BehaviorSubject<any[]>([
      "Item 1",
      "Item 2"
    ]);
    this.saSelectConfig.searchPlaceholder = "Search placeholder";
    this.saSelectConfig.emptyResultsText = "Empty result text";
  }

  ngOnInit(): void {
  }

}
