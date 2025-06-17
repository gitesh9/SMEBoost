import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UICommonModule } from './common/common.module';
import { ContentCreationForm } from './content-creation-form/content-creation-form';
import { Home } from './home/home';
import { ProductDetails } from './content-creation-form/product-details/product-details';
import { BrandingDetails } from './content-creation-form/branding-details/branding-details';
import { BusinessDetails } from './content-creation-form/business-details/business-details';
import { CustomerInsights } from './content-creation-form/customer-insights/customer-insights';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { BlogView } from './blog-view/blog-view';
import { SocialMediaCard } from './blog-view/social-media-card/social-media-card';
import { DemoBlog } from './demo-blog/demo-blog';

@NgModule({
  declarations: [
    AppComponent,
    ContentCreationForm,
    Home,
    ProductDetails,
    BrandingDetails,
    BusinessDetails,
    CustomerInsights,
    BlogView,
    SocialMediaCard,
    DemoBlog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UICommonModule,
    ReactiveFormsModule
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
