import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthRoutingModule, routingComponents } from './Auth-routing.module';


@Component({
  selector: 'app-auth',
  template: `<router-outlet></router-outlet>`
})
export class AuthComponent {
}


@NgModule({
  declarations: [AuthComponent, routingComponents],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class AuthModule { }
