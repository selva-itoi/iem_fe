import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EditorModule } from '../editor/editor.module';
import { FormHelperModule } from '../shared/form/form-hepler.module';
import { ImageUploadModule } from '../shared/shared.module';
import { ChangePasswordComponent } from './component/change-password/change-password.component';
import { EmailSenderComponent } from './component/email-sender/email-sender.component';
import { SearchModalComponent } from './component/search-modal/search-modal.component';
import { UserFooterComponent } from './component/user-footer/user-footer.component';
import { UserHeaderComponent } from './component/user-header/user-header.component';
import { UserLeftSideBarComponent } from './component/user-left-side-bar/user-left-side-bar.component';
import { UserRightSideBarComponent } from './component/user-right-side-bar/user-right-side-bar.component';


@NgModule({
  declarations: [UserHeaderComponent,
    UserFooterComponent,
    UserRightSideBarComponent,
    UserLeftSideBarComponent,
    EmailSenderComponent,
    ChangePasswordComponent,
    SearchModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    EditorModule,
    ImageUploadModule,
    FormHelperModule
  ],
  exports: [UserFooterComponent, UserHeaderComponent, UserRightSideBarComponent, UserLeftSideBarComponent]
})
export class CoreModule { }
