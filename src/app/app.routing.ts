import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';  
import { AuthguardService } from './logic/services/authguard.service';
import { ErrorComponent } from './pages/error/error.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: 'pages', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)},
  { path: '**', component: ErrorComponent }
]; 

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      //preloadingStrategy: PreloadAllModules, // <- comment this line for activate lazy load
    })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }