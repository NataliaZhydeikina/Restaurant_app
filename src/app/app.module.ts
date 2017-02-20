// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule }   from '@angular/router';
import { AgmCoreModule } from 'angular2-google-maps/core';
import { RatingModule } from 'ng2-rating';
// Directives
//import {GoogleplaceDirective} from 'angular2-google-map-autocomplete/directives/googleplace.directive';

// Main component
import { AppComponent } from './app.component';
// Auth components
import { ForgotPassFormComponent } from './components/auth/forgot-pass-form/forgot-pass-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NewPassComponent } from './components/auth/new-pass/new-pass.component';
import { RegisterFormComponent } from './components/auth/register-form/register-form.component';
// Layouts components
import { FooterComponent } from './components/layouts/footer/footer.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { LoaderComponent } from './components/layouts/loader/loader.component';
// Modules components
import { LogRegBtnsComponent } from './components/modules/log-reg-btns/log-reg-btns.component';
import { PrivacyPolicyComponent } from './components/modules/privacy-policy/privacy-policy.component';
import { SearchFormComponent } from './components/modules/search-form/search-form.component'
// Pages components
import { ItemPageComponent } from './components/pages/item-page/item-page.component'
import { ListItemComponent } from './components/pages/list-item/list-item.component'
import { ListReviewsComponent } from './components/pages/list-reviews/list-reviews.component';
import { ListViewComponent } from './components/pages/list-view/list-view.component';
import { MapComponent } from './components/pages/map/map.component';
import { WriteReviewComponent } from './components/pages/write-review/write-review.component';
import { SearchPageComponent } from './components/pages/search-page/search-page.component';
// Services
import { AuthService } from './services/auth/auth.service';
import { DatabaseService } from './services/database/database.service';
import { SearchFormService } from './services/search-form/search-form.service';
import { MapService } from './services/map/map.service';
import { LoaderService } from './services/loader/loader.service';
import { ShareService } from './services/share/share.service';
// Pipes
import { FilterArrayOfDishsPipe } from './pipes/dishes/filter-array-of-dishs.pipe';
// Routes
import configRoutes from './routes';
var routes = configRoutes();

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterFormComponent,
    PrivacyPolicyComponent,
    FooterComponent,
    LogRegBtnsComponent,
    ForgotPassFormComponent,
    NewPassComponent,
    SearchFormComponent,
    ListViewComponent,
    ListItemComponent,
<<<<<<< HEAD
    //GoogleplaceDirective,
=======
    GoogleplaceDirective,
>>>>>>> 76ce4054335a5e4195286978db132581ba56e810
    SearchPageComponent,
    MapComponent,
    ListReviewsComponent,
    WriteReviewComponent,
    FilterArrayOfDishsPipe,
    ItemPageComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RatingModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyA5wjntbEVsJQNlGpUgS57IEoNQNuB67KA',
      libraries: ["places"]
      })
  ],
  providers: [
     AuthService,
     DatabaseService,
     SearchFormService,
     MapService,
     LoaderService,
     ShareService
     ],
  bootstrap: [AppComponent]
})
export class AppModule { }
