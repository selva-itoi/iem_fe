import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ContentEditableValueDirective } from './content-editable-value.directive';
import { EditorComponent } from './editor/editor.component';
import { SafeHtmlPipe } from './pipe/safe-html.pipe';



@NgModule({
  declarations: [
    EditorComponent,
    ContentEditableValueDirective,
    SafeHtmlPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CKEditorModule,
  ],
  exports: [EditorComponent,SafeHtmlPipe]
})
export class EditorModule { }
