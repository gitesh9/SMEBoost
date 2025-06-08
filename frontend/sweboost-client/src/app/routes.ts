import { Routes } from "@angular/router";
import { AppComponent } from "./app.component";

export const routes: Routes = [
  { path: 'home', component: AppComponent },
  { path: 'about', component: AppComponent },
  { path: 'services', component: AppComponent },
  { path: 'pricing', component: AppComponent },
  { path: 'contacts', component: AppComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
