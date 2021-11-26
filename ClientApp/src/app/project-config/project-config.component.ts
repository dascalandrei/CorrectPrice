import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { forkJoin } from 'rxjs';

import { ProjectConfiguration, RoughProductConfiguration, UnitOfMeasure, ProjectCollectionConfiguration } from '../core/models/project-configuration.model';
import { Guid } from '../core/services/guid.service';
import { ProjectCollectionConfigService } from '../core/services/project-collection-config.service';

@Component({
    selector: 'project-config',
    templateUrl: './project-config.component.html',
    styleUrls: ['./project-config.component.scss']
})
export class ProjectConfigComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('formDirective') private formDirective: NgForm;
    @ViewChild('roughProductFormDirective') private roughProductFormDirective: NgForm;

    isLoaded = false;
    projectCollectionID: string;
    projectCollection: ProjectCollectionConfiguration;
    projects: ProjectConfiguration[];
    projectForm: FormGroup;
    updatedProjectConfiguration: ProjectConfiguration;
    projectRoughProductConfigurations: RoughProductConfiguration[];
    roughProductFormGroup: FormGroup;
    updatedRoughProductConfiguration: RoughProductConfiguration;
    unitOfMeasureValues: string[];
    expandCollectionProjects: boolean;
    expandRoughProducts: boolean;
    unitOfMeasures = UnitOfMeasure;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectCollectionConfigService: ProjectCollectionConfigService) {
    }

    ngOnInit() {
        this.projectCollectionID = this.route.snapshot.paramMap.get('id');

        if (this.projectCollectionID != this.projectCollectionConfigService.getCurrentCollectionID())
            this.projectCollectionConfigService.projectSelected(null);

        this.projectCollectionConfigService.projectCollectionSelected(this.projectCollectionID);

        this.unitOfMeasureValues = Object.keys(this.unitOfMeasures).filter(k => !isNaN(Number(k)));
        this.expandCollectionProjects = true;
        this.expandRoughProducts = false;

        this.loadConfiguration();
    }

    updateProject() {
        if (!this.projectForm.valid)
            return;

        const projectConfiguration: ProjectConfiguration = {
            id: this.updatedProjectConfiguration ? this.updatedProjectConfiguration.id : Guid.newGuid(),
            projectCollectionID: this.projectCollectionID,
            name: this.projectForm.get('name').value,
            description: this.projectForm.get('description').value,
            closeDate: null
        };

        this.projectCollectionConfigService.updateProject(projectConfiguration).subscribe(() => {
            this.expandRoughProducts = false;
            this.expandCollectionProjects = true;

            this.loadConfiguration();
        });
    }

    viewProject(project: ProjectConfiguration) {
        this.router.navigate(['/project-details', project.projectCollectionID, project.id]);
    }

    editProject(project: ProjectConfiguration) {
        this.updatedProjectConfiguration = project;

        this.initProjectForm();
    }


    deleteProject(project: ProjectConfiguration) {
        this.projectCollectionConfigService.deleteProject(project.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    editRoughProductAtProject(roughProductConfiguration: RoughProductConfiguration) {
        this.updatedRoughProductConfiguration = roughProductConfiguration;

        this.initRoughProductForm();
    }

    deleteRoughProductAtProject(roughProductConfiguration: RoughProductConfiguration) {
        this.projectCollectionConfigService.deleteRoughProductCollectionConfiguration(roughProductConfiguration.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    updateRoughProduct() {
        if (!this.roughProductFormGroup.valid)
            return;

        const roughProductConfiguration: RoughProductConfiguration = {
            id: this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.id : Guid.newGuid(),
            name: this.roughProductFormGroup.get('name').value,
            description: this.roughProductFormGroup.get('description').value,
            quantity: this.roughProductFormGroup.get('quantity').value,
            unitOfMeasure: Number(this.roughProductFormGroup.get('unitOfMeasure').value),
            cost: this.roughProductFormGroup.get('cost').value,
            effectiveDate: new Date(),
            projectID: null,
            importedID: null,
            projectCollectionID: this.projectCollectionID,
        };

        this.projectCollectionConfigService.updateRoughProductConfiguration(roughProductConfiguration).subscribe(() => {
            this.loadConfiguration();
            this.expandRoughProducts = true;
            this.expandCollectionProjects = false;
        });
    }

    private initProjectForm() {
        this.projectForm = new FormGroup({
            name: new FormControl(this.updatedProjectConfiguration ? this.updatedProjectConfiguration.name : '', Validators.required),
            description: new FormControl(this.updatedProjectConfiguration ? this.updatedProjectConfiguration.description : ''),
        });

        if (this.formDirective)
            this.formDirective.resetForm();
    }

    private initRoughProductForm() {
        this.roughProductFormGroup = new FormGroup({
            name: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.name : '', Validators.required),
            description: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.description : ''),
            quantity: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.quantity : '', Validators.required),
            unitOfMeasure: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.unitOfMeasure : '', Validators.required),
            cost: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.cost : '', Validators.required),
        });

        if (this.roughProductFormDirective) {
            this.roughProductFormDirective.resetForm();
        }
    }

    private loadConfiguration() {
        forkJoin(
            this.projectCollectionConfigService.detailProjectCollection(this.projectCollectionID),
            this.projectCollectionConfigService.listAllProjects(this.projectCollectionID),
            this.projectCollectionConfigService.listAllRoughProductConfigurationsByCollection(this.projectCollectionID)
        ).subscribe((response: [ProjectCollectionConfiguration, ProjectConfiguration[], RoughProductConfiguration[]]) => {
            this.projectCollection = response[0];
            this.projects = response[1];
            this.projectRoughProductConfigurations = response[2];

            this.projects.forEach((x: ProjectConfiguration) => {
                console.log(x.closeDate);
            });

            this.updatedProjectConfiguration = null;
            this.updatedRoughProductConfiguration = null;
            this.initProjectForm();
            this.initRoughProductForm();

            this.isLoaded = true;
        });
    }
}
