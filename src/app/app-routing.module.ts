import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [

      {
        path: '',
        loadChildren: () =>
          import('./modules/users/users.module').then(
            (m) => m.UsersModule
          ),
        data: { state: 'users' }
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./modules/users/users.module').then(
            (m) => m.UsersModule
          ),
        data: { state: 'users' }
      },
      {
        path: 'case',
        loadChildren: () =>
          import('./modules/case/case.module').then(
            (m) => m.CaseModule
          ),
        data: { state: 'case' }
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('./modules/customer/customer.module').then(
            (m) => m.CustomerModule
          ),
        data: { state: 'customers' }
      },
      {
        path: 'patients',
        loadChildren: () =>
          import('./modules/patients/patients.module').then(
            (m) => m.PatientsModule
          ),
        data: { state: 'Patients' }
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
