import { Component, OnInit } from '@angular/core';
import { formBuilderData } from 'src/app/helper/interface/response';
import { FORMS_TEMP_FORM } from '../../config/config';

@Component({
  selector: 'app-application-forms',
  templateUrl: './application-forms.component.html',
  styleUrls: ['./application-forms.component.scss']
})
export class ApplicationFormsComponent implements OnInit {
  ngOnInit(): void {
  }
  LIST_COL: formBuilderData[] = FORMS_TEMP_FORM
}
