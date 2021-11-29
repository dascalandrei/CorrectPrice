import { Injectable, EventEmitter } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { ApiHttpClient } from "./api-http-client.service";
import { ProjectCollectionConfiguration, ProjectConfiguration, RoughProductConfiguration, FiniteProductConfiguration, ProjectConfigurationDetails, EarningsItem, InvestmentItem, CashFlowData } from "../models/project-configuration.model";

@Injectable()
export class ProjectCollectionConfigService {
    constructor(private httpClient: ApiHttpClient) {
    }

    detailProjectConfigurationDetails(projectID: string): Observable<ProjectConfigurationDetails> {
        const formData: FormData = new FormData();
        formData.append("projectID", projectID);

        return this.httpClient.post<ProjectConfigurationDetails>('ProjectConfiguration/DetailProjectConfigurationDetails', formData)
    }

    detailProjectCollection(projectCollectionID: string): Observable<ProjectCollectionConfiguration> {
        const formData: FormData = new FormData();
        formData.append("projectCollectionID", projectCollectionID);

        return this.httpClient.post<ProjectCollectionConfiguration>('ProjectConfiguration/DetailProjectCollection', formData)
    }

    detailCashFlowData(startDate: Date, endDate: Date, projectCollectionID: string): Observable<CashFlowData> {
        const formData: FormData = new FormData();
        formData.append("startDate", startDate.toUTCString());
        formData.append("endDate", endDate.toUTCString());

        if (projectCollectionID)
            formData.append("projectCollectionID", projectCollectionID);

        return this.httpClient.post<CashFlowData>('ProjectConfiguration/DetailCashFlowData', formData)
    }

    listAllProjectCollections(): Observable<ProjectCollectionConfiguration[]> {
        return this.httpClient.post<ProjectCollectionConfiguration[]>('ProjectConfiguration/ListAllProjectCollections', null)
    }

    listAllProjects(projectCollectionID: string): Observable<ProjectConfiguration[]> {
        const formData: FormData = new FormData();
        formData.append("projectCollectionID", projectCollectionID);

        return this.httpClient.post<ProjectConfiguration[]>('ProjectConfiguration/ListAllProjects', formData)
    }

    listAllRoughProductConfigurationsByCollection(projectCollectionID: string): Observable<RoughProductConfiguration[]> {
        const formData: FormData = new FormData();
        formData.append("projectCollectionID", projectCollectionID);

        return this.httpClient.post<RoughProductConfiguration[]>('ProjectConfiguration/ListAllRoughProductConfigurationsByCollection', formData)
    }

    listAllRoughProductConfigurationsByProject(projectID: string): Observable<RoughProductConfiguration[]> {
        const formData: FormData = new FormData();
        formData.append("projectID", projectID);

        return this.httpClient.post<RoughProductConfiguration[]>('ProjectConfiguration/ListAllRoughProductConfigurationsByProject', formData)
    }

    listAllFiniteProductConfigurationsByProject(projectID: string): Observable<FiniteProductConfiguration[]> {
        const formData: FormData = new FormData();
        formData.append("projectID", projectID);

        return this.httpClient.post<FiniteProductConfiguration[]>('ProjectConfiguration/ListAllFiniteProductConfigurationsByProject', formData)
    }

    listAllEarnings(startDate: Date, endDate: Date, projectCollectionID: string): Observable<EarningsItem[]> {
        const formData: FormData = new FormData();
        formData.append("startDate", startDate.toUTCString());
        formData.append("endDate", endDate.toUTCString());

        if (projectCollectionID)
            formData.append("projectCollectionID", projectCollectionID);

        return this.httpClient.post<EarningsItem[]>('ProjectConfiguration/ListAllEarnings', formData);
    }

    listAllInvestments(startDate: Date, endDate: Date, projectCollectionID: string): Observable<InvestmentItem[]> {
        const formData: FormData = new FormData();
        formData.append("startDate", startDate.toUTCString());
        formData.append("endDate", endDate.toUTCString());

        if (projectCollectionID)
            formData.append("projectCollectionID", projectCollectionID);

        return this.httpClient.post<InvestmentItem[]>('ProjectConfiguration/ListAllInvestments', formData);
    }

    updateProjectCollection(projectCollectionConfiguration: ProjectCollectionConfiguration) {
        return this.httpClient.post('ProjectConfiguration/UpdateProjectCollectionConfiguration', projectCollectionConfiguration);
    }

    updateProject(projectConfiguration: ProjectConfiguration) {
        return this.httpClient.post('ProjectConfiguration/UpdateProjectConfiguration', projectConfiguration);
    }

    updateRoughProductConfiguration(roughProductConfiguration: RoughProductConfiguration) {
        return this.httpClient.post('ProjectConfiguration/UpdateRoughProductConfiguration', roughProductConfiguration);
    }

    updateFiniteProductConfiguration(finiteProductConfiguration: FiniteProductConfiguration) {
        return this.httpClient.post('ProjectConfiguration/UpdateFiniteProductConfiguration', finiteProductConfiguration);
    }

    updateEarningsItem(earningsItem: EarningsItem) {
        return this.httpClient.post('ProjectConfiguration/UpdateEarningsItem', earningsItem);
    }

    updateInvestmentsItem(investmentItem: InvestmentItem) {
        return this.httpClient.post('ProjectConfiguration/UpdateInvestmentItem', investmentItem);
    }

    deleteProjectCollection(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteProjectCollectionConfiguration', formData);
    }

    deleteProject(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteProjectConfiguration', formData);
    }

    deleteRoughProductConfiguration(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteRoughProductConfiguration', formData);
    }

    deleteRoughProductCollectionConfiguration(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteRoughProductCollectionConfiguration', formData);
    }

    deleteFiniteProductConfiguration(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteFiniteProductConfiguration', formData);
    }

    deleteEarningsItem(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteEarningsItem', formData);
    }

    deleteInvestmentItem(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteInvestmentItem', formData);
    }

    calculateFiniteProductCosts(finiteProductConfiguration: FiniteProductConfiguration): Observable<FiniteProductConfiguration> {
        return this.httpClient.post('ProjectConfiguration/CalculateFiniteProductCosts', finiteProductConfiguration);
    }

    closeProject(id: string, closingDate: Date, earnings: number) {
        const formData: FormData = new FormData();
        formData.append("id", id);
        formData.append("closingDate", closingDate.toUTCString());
        formData.append("earnings", earnings.toString());

        return this.httpClient.post('ProjectConfiguration/CloseProject', formData);
    }
}
