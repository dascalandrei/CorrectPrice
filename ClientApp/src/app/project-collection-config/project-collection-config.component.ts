import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, NgForm } from '@angular/forms';

import { ProjectCollectionConfigService } from '../core/services/project-collection-config.service';
import { ProjectCollectionConfiguration } from '../core/models/project-configuration.model';
import { Guid } from '../core/services/guid.service';

@Component({
    selector: 'project-collection-config',
    templateUrl: './project-collection-config.component.html',
    styleUrls: ['./project-collection-config.component.scss']
})
export class ProjectCollectionConfigComponent implements OnInit {
    @ViewChild('formDirective') private formDirective: NgForm;

    isLoaded = false;
    projectCollections: ProjectCollectionConfiguration[];
    projectCollectionForm: FormGroup;
    updatedProjectCollection: ProjectCollectionConfiguration;

    constructor(
        private router: Router,
        private projectCollectionConfigService: ProjectCollectionConfigService) {
    }

    ngOnInit() {
        this.loadConfiguration();
    }

    updateProjectCollection() {
        if (!this.projectCollectionForm.valid)
            return;

        const projectCollectionConfiguration: ProjectCollectionConfiguration = {
            id: this.updatedProjectCollection ? this.updatedProjectCollection.id : Guid.newGuid(),
            name: this.projectCollectionForm.get('name').value,
            description: this.projectCollectionForm.get('description').value
        };

        this.projectCollectionConfigService.updateProjectCollection(projectCollectionConfiguration).subscribe(() => {
            this.loadConfiguration();
        });
    }

    viewProjectCollection(projectCollection: ProjectCollectionConfiguration) {
        this.router.navigate(['/project-collection', projectCollection.id]);
    }

    editProjectCollection(projectCollection: ProjectCollectionConfiguration) {
        this.updatedProjectCollection = projectCollection;

        this.projectCollectionForm = new FormGroup({
            name: new FormControl(projectCollection.name, Validators.required),
            description: new FormControl(projectCollection.description),
        });
    }

    deleteProjectCollection(projectCollection: ProjectCollectionConfiguration) {
        this.projectCollectionConfigService.deleteProjectCollection(projectCollection.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    resetForm() {
        this.updatedProjectCollection = null;
        this.initForm();
    }

    private initForm() {
        this.projectCollectionForm = new FormGroup({
            name: new FormControl('', Validators.required),
            description: new FormControl(''),
        });

        if (this.formDirective)
            this.formDirective.resetForm();
    }

    private loadConfiguration() {
        this.projectCollectionConfigService.listAllProjectCollections().subscribe((projectCollections: ProjectCollectionConfiguration[]) => {
            this.projectCollections = projectCollections;
            this.updatedProjectCollection = null;
            this.initForm();

            this.isLoaded = true;
        });
    }
}
