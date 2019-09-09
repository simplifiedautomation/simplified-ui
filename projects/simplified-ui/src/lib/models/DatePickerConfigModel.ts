import { DateFormats } from '../pipes/sa-date-time.pipe';

/**
 *This model is used to assign configurations for date picker
 * */
export class DatePickerConfig {
  min?: Date = null;
  max?: Date = null;
  /**
   * Set the type of the dateTime picker. 'both': show both calendar and timer;
   * 'calendar': only show calendar; 'timer': only show timer.
   */
  pickerType?: DatePickerType = DatePickerType.both;  // both | calendar | timer
  /**
   * Specify the style the picker would open as.
   */
  pickerMode?: DatePickerMode = DatePickerMode.popup; // 'popup' | 'dialog'
  /**
   * Specify the view that the calendar should start in.
   */
  startView?: DatePickerStartView = DatePickerStartView.month; // 'month' | 'year' | 'multi-years'
  /**
   * Specify the picker initial moment.
   */
  startAt?: Date = null;
  /**
   * Set the first day of week. Valid value is from 0 to 6. 0: Sunday ~ 6: Saturday
   */
  firstDayOfWeek?: number = 0;
  /**
   * Whether to hide dates in other months at the start or end of the current month
   */
  hideOtherMonths?: boolean = false;
  /**
   * When specify it to true, the timer would be in hour12 format mode
   */
  hour12Timer?: boolean = false;
  /**
   * Hours to change per step.
   */
  stepHour?: number = 1;
  /**
   * Minutes to change per step.
   */
  stepMinute?: number = 1;
  /**
   * Seconds to change per step.
   */
  stepSecond?: number = 1;
  /**
   * When specify to true, it would disable the picker.
   */
  disabled?: boolean = false;
  /**
   * Specify the picker's select mode. 'single': a single value allowed;
   * 'range': allow users to select a range of date-time;
   * 'rangeFrom': the input would only show the 'from' value and
   * the picker could only selects 'from' value;
   * 'rangeTo': the input would only show the
   * 'to' value and the picker could only selects 'to' value..
   */
  selectMode?: DatePickerSelectMode = DatePickerSelectMode.single; //'single' | 'range' | 'rangeFrom' | 'rangeTo'

  placeholder: string = "Select Date";

  dateFormat?: any;
}

export enum DatePickerType {
  both = "both",
  calendar = "calendar",
  timer = "timer"
}

export enum DatePickerMode {
  popup = "popup",
  dialog = "dialog"
}
export enum DatePickerStartView {
  month = "month",
  year = "year",
  multiYears = "multi-years"
}
export enum DatePickerSelectMode {
  single = "single",
  range = "range",
  rangeFrom = "rangeFrom",
  rangeTo="rangeTo"
}
