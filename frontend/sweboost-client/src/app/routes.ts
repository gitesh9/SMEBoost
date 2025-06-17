import { Routes } from "@angular/router";
import { ContentCreationForm } from "./content-creation-form/content-creation-form";
import { Home } from "./home/home";
import { BlogView } from "./blog-view/blog-view";
import { DemoBlog } from "./demo-blog/demo-blog";

export const routes: Routes = [
  { path: 'home', component: Home },
  { path: 'about', component: Home },
  { path: 'services', component: ContentCreationForm },
  { path: 'pricing', component: Home },
  { path: 'blog', component: BlogView },
  { path: 'demo-blog', component: DemoBlog },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];
