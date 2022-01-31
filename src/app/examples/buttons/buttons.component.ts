import { Component, OnInit } from '@angular/core';
import { SaButtonConfig, SaButtonType } from '../../../../projects/simplified-ui/src/lib/sa-button/sa-button.component';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  saButtonConfigs: SaButtonConfig[] = [
    new SaButtonConfig('primary'),
    new SaButtonConfig('secondary'),
    new SaButtonConfig('anchor'),
  ];

  constructor() { }

  ngOnInit(): void {
    this.saButtonConfigs[0].type = SaButtonType.Primary;
    this.saButtonConfigs[1].type = SaButtonType.Secondary;
    this.saButtonConfigs[2].type = SaButtonType.Anchor;

    this.saButtonConfigs[0].loadingText = 'Loading ...';
    this.saButtonConfigs[0].loadingStopped.subscribe((val) => {
      console.log("Lading Stopped : ",val);
    })
    /*this.saButtonConfig.isDisabled = false;
    this.saButtonConfig.type = SaButtonType.Secondary;
    this.saButtonConfig.isSpinning = false;
    this.saButtonConfig.loadingText = "Loading ...";
    this.saButtonConfig.loadingStopped.subscribe((val) => {
      if(val) {
        console.log("Loading stopped true");
      }
      else {
        console.log("Loading stopped false");
      }
    }) */
  }

  onButtonClick(saButtonConfig: SaButtonConfig) {
    saButtonConfig.isSpinning = !saButtonConfig.isSpinning;
  }

  toggleDisability(saButtonConfig: SaButtonConfig) {
    saButtonConfig.isDisabled = !saButtonConfig.isDisabled;
  }

  toggleLoading(saButtonConfig: SaButtonConfig) {
    saButtonConfig.isSpinning = !saButtonConfig.isSpinning;
  }

}
