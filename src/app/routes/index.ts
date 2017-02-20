import { ListViewComponent } from '../components/pages/list-view/list-view.component';
import { SearchPageComponent } from '../components/pages/search-page/search-page.component';
import { MapComponent } from '../components/pages/map/map.component';
import { WriteReviewComponent } from '../components/pages/write-review/write-review.component';
import { LoginComponent } from '../components/auth/login/login.component';
import { RegisterFormComponent } from '../components/auth/register-form/register-form.component';
import { NewPassComponent } from '../components/auth/new-pass/new-pass.component';
import { ForgotPassFormComponent } from '../components/auth/forgot-pass-form/forgot-pass-form.component';
import { ItemPageComponent } from '../components/pages/item-page/item-page.component'

export default function configRoutes() {
  return [
        {
        path: 'login',
        component: LoginComponent
        },
        {
        path: 'register',
        component: RegisterFormComponent
        },
        {
        path: 'chenge-pass',
        component: ForgotPassFormComponent
        },
        {
        path: 'enter-pass',
        component: NewPassComponent
        },
        {
        path: 'list',
        component: ListViewComponent
        },
        {
        path: '',
        component: SearchPageComponent
        },
        {
        path: 'map',
        component: MapComponent
        },
        {
        path: 'write-review',
        component: WriteReviewComponent
        },
        {
        path: 'write-review',
        component: WriteReviewComponent
        },
        {
        path: 'item',
        component: ItemPageComponent
        },
        {
        path: '**', 
        redirectTo: '/',
        }
    ];

}
