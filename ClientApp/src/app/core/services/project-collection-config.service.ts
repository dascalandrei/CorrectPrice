import { Injectable, EventEmitter } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { ApiHttpClient } from "./api-http-client.service";
import { ProjectCollectionConfiguration, ProjectConfiguration, RoughProductConfiguration, FiniteProductConfiguration, ProjectConfigurationDetails } from "../models/project-configuration.model";

@Injectable()
export class ProjectCollectionConfigService {
    projectCollectionIDObservable: Observable<string>;
    projectIDObservable: Observable<string>;

    private projectCollectionID: BehaviorSubject<string>;
    private projectID: BehaviorSubject<string>;

    constructor(private httpClient: ApiHttpClient) {
        this.projectCollectionID = new BehaviorSubject<string>(null);
        this.projectID = new BehaviorSubject<string>(null);

        this.projectCollectionIDObservable = this.projectCollectionID.asObservable();
        this.projectIDObservable = this.projectID.asObservable();
    }

    projectCollectionSelected(projectCollectionID: string) {
        this.projectCollectionID.next(projectCollectionID);
    }

    projectSelected(projectID: string) {
        this.projectID.next(projectID);
    }

    detailProjectConfigurationDetails(projectID: string): Observable<ProjectConfigurationDetails> {
        const formData: FormData = new FormData();
        formData.append("projectID", projectID);

        return this.httpClient.post<ProjectConfigurationDetails>('ProjectConfiguration/DetailProjectConfigurationDetails', formData)
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

    calculateFiniteProductCosts(finiteProductConfiguration: FiniteProductConfiguration): Observable<FiniteProductConfiguration> {
        return this.httpClient.post('ProjectConfiguration/CalculateFiniteProductCosts', finiteProductConfiguration);
    }
}
