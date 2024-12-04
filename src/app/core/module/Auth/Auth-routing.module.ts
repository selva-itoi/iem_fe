import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UrlServices } from 'src/app/helper/class/url-services';
import { ForgotPasswordComponent } from '../../component/forgot-password/forgot-password.component';
import { UserLoginComponent } from '../../component/user-login/user-login.component';
const def = {
  path: UrlServices.AUTH_PAGE.LOGIN_URL.split(/[/]+/).pop(),
  component: UserLoginComponent,
  data: {
    title: 'Login',
  }
};
const dr= {...def};
dr.path='pw';
const routes: Routes = [
  {...def},
  {...dr},
  {
    path: UrlServices.AUTH_PAGE.FORGOT_PASSWORD_URL.split(/[/]+/).pop(),
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot Password',
    },
  },
  {...(Object.assign({},def,{path : ''}))}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
export const routingComponents = [UserLoginComponent, ForgotPasswordComponent];