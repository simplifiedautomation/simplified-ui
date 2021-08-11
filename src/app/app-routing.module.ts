import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './examples/home/home.component';
import { ButtonsComponent } from './examples/buttons/buttons.component';
import { CurrencyInputComponent } from './examples/currency-input/currency-input.component';
import { StepperComponent } from './examples/stepper/stepper.component';
import { DataFilterComponent } from './examples/data-filter/data-filter.component';
import { MoreMenuComponent } from './examples/more-menu/more-menu.component';
import { DatePickerComponent } from './examples/date-picker/date-picker.component';
import { SelectComponent } from './examples/select/select.component';
import { TableOfContentsComponent } from './examples/table-of-contents/table-of-contents.component';
import { TextEditorComponent } from './examples/text-editor/text-editor.component';
import { PageHeaderComponent } from './examples/page-header/page-header.component';
import { DataTableComponent } from './examples/data-table/data-table.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'buttons',component: ButtonsComponent},
  {path: 'currency-input',component: CurrencyInputComponent},
  {path: 'stepper',component: StepperComponent},
  {path: 'data-filter',component: DataFilterComponent},
  {path: 'more-menu',component: MoreMenuComponent},
  {path: 'date-picker',component: DatePickerComponent},
  {path: 'select',component: SelectComponent},
  {path: 'home',component: HomeComponent},
  {path: 'toc',component: TableOfContentsComponent},
  {path: 'text-editor',component: TextEditorComponent},
  {path: 'page-header', component: PageHeaderComponent},
  {path: 'data-table',component: DataTableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
