import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign, CampaignPayload, CampaignPerformance } from '../../shared/models/campaign.model';
import { LandingPage, LandingStatus } from '../../shared/models/landing-page.model';
import { Customer, CustomerSegment, SegmentPayload } from '../../shared/models/customer.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = '/api/v1';
  // Keep a single place for HTTP calls so the rest of the app stays clean
  constructor(private http: HttpClient) { }

  // auth login
  login(email: string, password: string) {
    return this.http.post<{ access: string; refresh: string }>(`${this.base}/auth/login`, { email, password });
  }

  // campaigns
  listCampaigns(): Observable<Campaign[]> {
    // Server already sorts campaigns, so just pass the list through
    return this.http.get<Campaign[]>(`${this.base}/campaigns`);
  }
  createCampaign(c: Campaign): Observable<Campaign> {
    return this.http.post<Campaign>(`${this.base}/campaigns`, c);
  }
  getCampaign(id: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.base}/campaigns/${id}`);
  }
  updateCampaign(id: string, c: Partial<Campaign>): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.base}/campaigns/${id}`, c);
  }
  deleteCampaign(id: string) {
    return this.http.delete(`${this.base}/campaigns/${id}`);
  }


  // Landing pages
  listLandingPages() { return this.http.get<LandingPage[]>(`${this.base}/landing-pages`); }
  getLandingPage(id: string) { return this.http.get<LandingPage>(`${this.base}/landing-pages/${id}`); }
  createLandingPage(p: LandingPage) { return this.http.post<LandingPage>(`${this.base}/landing-pages`, p); }
  updateLandingPage(id: string, p: Partial<LandingPage>) { return this.http.patch<LandingPage>(`${this.base}/landing-pages/${id}`, p); }
  deleteLandingPage(id: string) { return this.http.delete(`${this.base}/landing-pages/${id}`); }


  // --- customers (read-only) ---
  listCustomers() {
    return this.http.get<Customer[]>(`${this.base}/customers`);
  }

  // --- segments (CRUD) ---
  listSegments() {
    return this.http.get<CustomerSegment[]>(`${this.base}/segments`);
  }
  getSegment(id: string) {
    return this.http.get<CustomerSegment>(`${this.base}/segments/${id}`);
  }
  createSegment(p: SegmentPayload) {
    return this.http.post<CustomerSegment>(`${this.base}/segments`, p);
  }
  updateSegment(id: string, p: Partial<SegmentPayload>) {
    return this.http.patch<CustomerSegment>(`${this.base}/segments/${id}`, p);
  }
  deleteSegment(id: string) {
    return this.http.delete(`${this.base}/segments/${id}`);
  }

  // --- performance (read-only) ---
  getPerformance() {
    return this.http.get<CampaignPerformance[]>(`${this.base}/performance`);
  }


}
