import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGeneratorComponent } from './component/form-generator/form-generator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageUploadModule } from '../shared.module';
import { ChipsModule } from 'primeng/chips';
import { EditorModule } from 'src/app/editor/editor.module';
import { CalendarModule } from 'primeng/calendar';
import { ConditionOperatorPipe } from './pipe/condtion-operator.pipe';
import { TransformArrayPipe } from './pipe/transform-array.pipe';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmModalComponent } from './component/confirm-modal/confirm-modal.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormControlActionPipe } from './pipe/form-control-action.pipe';
import { TableListComponent } from './component/table-list/table-list.component';
import { DynamicTableFormComponent } from './component/dynamic-table-form/dynamic-table-form.component';
import { CurrencyFormatPipe } from './pipe/currency-format.pipe';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormDocComponent } from './component/form-doc/form-doc.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { SharedModule } from "../shared.module";

@NgModule({
    declarations: [
        ConfirmModalComponent,
        FormGeneratorComponent,
        TableListComponent,
        ConditionOperatorPipe,
        TransformArrayPipe,
        FormControlActionPipe,
        DynamicTableFormComponent,
        FormDocComponent,
        CurrencyFormatPipe
    ],
    providers: [ConditionOperatorPipe], exports: [FormGeneratorComponent, FormDocComponent, TableListComponent, ConditionOperatorPipe, DynamicTableFormComponent, CurrencyFormatPipe],
    imports: [
        CommonModule,
        MultiSelectModule,
        TableModule,
        DropdownModule,
        AutoCompleteModule,
        ColorPickerModule,
        CalendarModule,
        FormsModule,
        ReactiveFormsModule,
        ImageUploadModule,
        ChipsModule,
        EditorModule,
        SharedModule
    ]
})
export class FormHelperModule { }
