import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/login/login.component';
import { CampaignListComponent } from './features/campaigns/campaign-list/campaign-list.component';
import { CampaignFormComponent } from './features/campaigns/campaign-form/campaign-form.component';
import { SegmentListComponent } from './features/segments/segment-list/segment-list.component';
import { SegmentFormComponent } from './features/segments/segment-form/segment-form.component';
import { ReportingComponent } from './features/reporting/reporting.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LandingListComponent } from './features/landing/landing-list/landing-list.component';
import { LandingFormComponent } from './features/landing/landing-form/landing-form.component';
import { MainLayoutComponent } from './core/layout/main-layout.component';

// All feature pages stay behind the guard except for login itself
export const routes: Routes = [
    { path: 'login', component: LoginComponent },

    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'campaigns', component: CampaignListComponent },
            { path: 'campaigns/new', component: CampaignFormComponent },
            { path: 'campaigns/:id', component: CampaignFormComponent },
            { path: 'landing-pages', component: LandingListComponent },
            { path: 'landing-pages/new', component: LandingFormComponent },
            { path: 'landing-pages/:id', component: LandingFormComponent },
            { path: 'segments', component: SegmentListComponent },
            { path: 'segments/new', component: SegmentFormComponent },
            { path: 'segments/:id', component: SegmentFormComponent },
            { path: 'reporting', component: ReportingComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

];
