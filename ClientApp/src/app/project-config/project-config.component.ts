import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';

import { ProjectConfiguration } from '../core/models/project-configuration.model';
import { Guid } from '../core/services/guid.service';
import { ProjectCollectionConfigService } from '../core/services/project-collection-config.service';

@Component({
    selector: 'project-config',
    templateUrl: './project-config.component.html',
    styleUrls: ['./project-config.component.scss']
})
export class ProjectConfigComponent implements OnInit {
    @ViewChild('formDirective') private formDirective: NgForm;

    isLoaded = false;
    projects: ProjectConfiguration[];
    projectForm: FormGroup;
    updatedProjectConfiguration: ProjectConfiguration;

    private projectCollectionID: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectCollectionConfigService: ProjectCollectionConfigService) {
    }

    ngOnInit() {
        this.projectCollectionID = this.route.snapshot.paramMap.get('id');

        this.projectCollectionConfigService.projectCollectionSelected(this.projectCollectionID);

        this.loadConfiguration();
    }

    updateProject() {
        if (!this.projectForm.valid)
            return;

        const projectConfiguration: ProjectConfiguration = {
            id: this.updatedProjectConfiguration ? this.updatedProjectConfiguration.id : Guid.newGuid(),
            projectCollectionID: this.projectForm.get('projectCollectionID').value,
            name: this.projectForm.get('name').value,
            description: this.projectForm.get('description').value
        };

        this.projectCollectionConfigService.updateProject(projectConfiguration).subscribe(() => {
            this.loadConfiguration();
        });
    }

    viewProject(project: ProjectConfiguration) {
        this.router.navigate(['/project-details', project.projectCollectionID, project.id]);
    }

    editProject(project: ProjectConfiguration) {
        this.updatedProjectConfiguration = project;

        this.projectForm = new FormGroup({
            projectCollectionID: new FormControl({ value: project.projectCollectionID, disabled: true }, Validators.required),
            name: new FormControl(project.name, Validators.required),
            description: new FormControl(project.description),
        });
    }

    deleteProject(project: ProjectConfiguration) {
        this.projectCollectionConfigService.deleteProject(project.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    private initForm() {
        this.projectForm = new FormGroup({
            projectCollectionID: new FormControl({ value: this.projectCollectionID, disabled: true }, Validators.required),
            name: new FormControl('', Validators.required),
            description: new FormControl(''),
        });

        if (this.formDirective)
            this.formDirective.resetForm();
    }

    private loadConfiguration() {
        this.projectCollectionConfigService.listAllProjects(this.projectCollectionID).subscribe((projects: ProjectConfiguration[]) => {
            this.projects = projects;
            this.updatedProjectConfiguration = null;
            this.initForm();

            this.isLoaded = true;
        });
    }
}
