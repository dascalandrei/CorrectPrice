import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatNativeDateModule } from '@angular/material/core';

import { ApiHttpClient } from './core/services/api-http-client.service';
import { Guid } from './core/services/guid.service';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ProjectCollectionConfigComponent } from './project-collection-config/project-collection-config.component';
import { ProjectCollectionConfigService } from './core/services/project-collection-config.service';
import { AuthGuardService } from './core/guards/AuthGuard';
import { LoginService } from './core/services/login.service';
import { ProjectConfigComponent } from './project-config/project-config.component';
import { ProjectDetailsConfigComponent } from './project-details-config/project-details-config.component';
import { FinanceDetailsComponent } from './finance-details/finance-details.component';
import { DatePipe } from '@angular/common';


@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        ProjectCollectionConfigComponent,
        ProjectConfigComponent,
        ProjectDetailsConfigComponent,
        FinanceDetailsComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatExpansionModule,
        MatDatepickerModule,
        BrowserAnimationsModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatTableModule,
        MatNativeDateModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
            { path: 'finance-details', component: FinanceDetailsComponent, canActivate: [AuthGuardService] },
            { path: 'client-projects-collection', component: ProjectCollectionConfigComponent, canActivate: [AuthGuardService] },
            { path: 'project-collection/:id', component: ProjectConfigComponent, canActivate: [AuthGuardService] },
            { path: 'project-details/:collectionID/:projectID', component: ProjectDetailsConfigComponent, canActivate: [AuthGuardService] }
        ], { relativeLinkResolution: 'legacy' })
    ],
    providers: [{
        provide: LOCALE_ID,
        useValue: 'ro-RO'
    }, {
        provide: DEFAULT_CURRENCY_CODE,
        useValue: 'RON'
    },
        ApiHttpClient,
        ProjectCollectionConfigService,
        LoginService,
        AuthGuardService,
        Guid,
        DatePipe
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
