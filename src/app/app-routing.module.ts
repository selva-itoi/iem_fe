import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard, LogoutGuard } from './helper/guard/login.guard';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DefaultComponent } from './layouts/default/default.component';

export class AppResolver  {
  resolve() {
      const promise = new Promise((resolve, reject) => {
          resolve(true);
      });
      return promise;
  }
}


const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '', loadChildren: () => import('./core/module/Auth/Auth.module').then(m => m.AuthModule),
        canActivate: [LogoutGuard]
      },
    ]
  },
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '', loadChildren: () => import('./modules/modules.module').then(m => m.ModulesModule),
        canActivate: [LoginGuard]
      },
    ]
  },
];

@NgModule({
  providers :[AppResolver],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [DefaultComponent, AuthLayoutComponent];

