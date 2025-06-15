import { Routes } from "@angular/router";
import { ContentCreationForm } from "./content-creation-form/content-creation-form";
import { Home } from "./home/home";

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', component: Home },
  { path: 'services', component: ContentCreationForm },
  { path: 'pricing', component: Home },
  { path: 'contacts', component: Home },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
