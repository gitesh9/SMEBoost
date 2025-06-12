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

@NgModule({
  declarations: [
    AppComponent,
    ContentCreationForm,
    Home,
    ProductDetails,
    BrandingDetails,
    BusinessDetails,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UICommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
