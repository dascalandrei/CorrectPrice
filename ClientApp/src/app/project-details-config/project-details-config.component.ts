import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { Guid } from '../core/services/guid.service';
import { forkJoin } from 'rxjs';

import { RoughProductConfiguration, UnitOfMeasure } from '../core/models/project-configuration.model';
import { ProjectCollectionConfigService } from '../core/services/project-collection-config.service';

@Component({
    selector: 'project-details-config',
    templateUrl: './project-details-config.component.html',
    styleUrls: ['./project-details-config.component.scss']
})
export class ProjectDetailsConfigComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('roughProductformDirective') private roughProductformDirective: NgForm;

    collectionRoughProductConfigurations: RoughProductConfiguration[];
    projectRoughProductConfigurations: RoughProductConfiguration[];
    unitOfMeasureValues: string[];
    roughProductFormGroup: FormGroup;
    expandFinalProducts: boolean;
    expandRoughProducts: boolean;
    unitOfMeasures = UnitOfMeasure;

    private projectCollectionID: string;
    private projectID: string;

    constructor(
        private route: ActivatedRoute,
        private projectCollectionConfigService: ProjectCollectionConfigService) {
    }

    ngOnInit() {
        this.projectCollectionID = this.route.snapshot.paramMap.get('collectionID');
        this.projectID = this.route.snapshot.paramMap.get('projectID');

        this.expandFinalProducts = true;

        this.loadConfiguration();

        this.unitOfMeasureValues = Object.keys(this.unitOfMeasures).filter(k => !isNaN(Number(k)));

        this.initRoughProductForm();
    }

    updateRoughProduct() {
        if (!this.roughProductFormGroup.valid)
            return;

        const includeInCollection: boolean = this.roughProductFormGroup.get('includeInCollection').value;

        const roughProductConfiguration: RoughProductConfiguration = {
            id: Guid.newGuid(),
            name: this.roughProductFormGroup.get('name').value,
            description: this.roughProductFormGroup.get('description').value,
            quantity: this.roughProductFormGroup.get('quantity').value,
            unitOfMeasure: Number(this.roughProductFormGroup.get('unitOfMeasure').value),
            cost: this.roughProductFormGroup.get('cost').value,
            effectiveDate: new Date(),
            projectID: this.projectID,
            projectCollectionID: includeInCollection ? this.projectCollectionID : null
        };

        this.projectCollectionConfigService.updateRoughProductConfiguration(roughProductConfiguration).subscribe(() => {
            this.loadConfiguration();
            this.expandFinalProducts = false;
            this.expandRoughProducts = true;
        });
    }

    private initRoughProductForm() {
        this.roughProductFormGroup = new FormGroup({
            name: new FormControl('', Validators.required),
            description: new FormControl(''),
            quantity: new FormControl('', Validators.required),
            unitOfMeasure: new FormControl('', Validators.required),
            cost: new FormControl('', Validators.required),
            includeInCollection: new FormControl(false),
        });

        if (this.roughProductformDirective)
            this.roughProductformDirective.resetForm();
    }

    private loadConfiguration() {
        forkJoin(
            this.projectCollectionConfigService.listAllRoughProductConfigurationsByCollection(this.projectCollectionID),
            this.projectCollectionConfigService.listAllRoughProductConfigurationsByProject(this.projectID),
        ).subscribe((response: [RoughProductConfiguration[], RoughProductConfiguration[]]) => {
            this.collectionRoughProductConfigurations = response[0];
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.collectionRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations = response[1];
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);
            this.projectRoughProductConfigurations.push(response[0][0]);

            this.initRoughProductForm();
        });
    }
}
