import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "./api-http-client.service";
import { ProjectCollectionConfiguration, ProjectConfiguration, RoughProductConfiguration, FiniteProductConfiguration } from "../models/project-configuration.model";

@Injectable()
export class ProjectCollectionConfigService {
    constructor(private httpClient: ApiHttpClient) {
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

    deleteFiniteProductConfiguration(id: string) {
        const formData: FormData = new FormData();
        formData.append("id", id);

        return this.httpClient.post('ProjectConfiguration/DeleteFiniteProductConfiguration', formData);
    }
}
