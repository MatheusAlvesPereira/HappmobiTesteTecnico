import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { HeaderComponent } from './components/header/header.component';
import { VehicleCardComponent } from './components/vehicle-card/vehicle-card.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { FilterComponent } from './filter/filter.component';
import { FilterResultsComponent } from './pages/filter-results/filter-results.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VehiclesComponent,
    ReservationsComponent,
    HeaderComponent,
    VehicleCardComponent,
    ForgotPasswordComponent,
    FilterComponent,
    FilterResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
