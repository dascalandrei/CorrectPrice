import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { Guid } from '../core/services/guid.service';
import { forkJoin } from 'rxjs';

import { RoughProductConfiguration, UnitOfMeasure, FiniteProductConfiguration, ProductDetails } from '../core/models/project-configuration.model';
import { ProjectCollectionConfigService } from '../core/services/project-collection-config.service';

@Component({
    selector: 'project-details-config',
    templateUrl: './project-details-config.component.html',
    styleUrls: ['./project-details-config.component.scss']
})
export class ProjectDetailsConfigComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('roughProductformDirective') private roughProductFormDirective: NgForm;
    @ViewChild('finiteProductformDirective') private finiteProductFormDirective: NgForm;

    collectionRoughProductConfigurations: RoughProductConfiguration[];
    projectRoughProductConfigurations: RoughProductConfiguration[];
    projectFiniteProductConfigurations: FiniteProductConfiguration[];
    unitOfMeasureValues: string[];
    roughProductFormGroup: FormGroup;
    finiteProductFormGroup: FormGroup;
    expandFinalProducts: boolean;
    expandRoughProducts: boolean;
    expandRoughCollectionProducts: boolean;
    updatedRoughProductConfiguration: RoughProductConfiguration;
    updatedFiniteProductConfiguration: FiniteProductConfiguration;
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

        this.projectCollectionConfigService.projectCollectionSelected(this.projectCollectionID);
        this.projectCollectionConfigService.projectSelected(this.projectID);

        this.expandFinalProducts = true;
        this.unitOfMeasureValues = Object.keys(this.unitOfMeasures).filter(k => !isNaN(Number(k)));

        this.loadConfiguration();
    }

    importRoughProductAtProject(roughProductConfiguration: RoughProductConfiguration) {
        roughProductConfiguration.projectID = this.projectID;

        this.projectCollectionConfigService.updateRoughProductConfiguration(roughProductConfiguration).subscribe(() => {
            this.loadConfiguration();
            this.expandFinalProducts = false;
            this.expandRoughProducts = false;
            this.expandRoughCollectionProducts = true;
        });
    }

    editRoughProductAtProject(roughProductConfiguration: RoughProductConfiguration) {
        this.updatedRoughProductConfiguration = roughProductConfiguration;

        this.initRoughProductForm();
    }

    updateRoughProduct() {
        if (!this.roughProductFormGroup.valid)
            return;

        const includeInCollection: boolean = this.roughProductFormGroup.get('includeInCollection').value;

        const roughProductConfiguration: RoughProductConfiguration = {
            id: this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.id : Guid.newGuid(),
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
            this.expandRoughCollectionProducts = false;
            this.updatedRoughProductConfiguration = null;
        });
    }

    editFiniteProductAtProject(finiteProductConfiguration: FiniteProductConfiguration) {
        this.updatedFiniteProductConfiguration = finiteProductConfiguration;

        this.initFiniteProductForm();
    }

    addNewRoughProductToAFiniteProduct(finiteProductForm: FormGroup, roughProductID: string) {
        const roughProductConfiguration: RoughProductConfiguration = this.projectRoughProductConfigurations.find(product => product.id === roughProductID);

        (finiteProductForm.get('productDetails') as FormArray).push(new FormGroup({
            id: new FormControl({ value: roughProductConfiguration.id, hidden: true }),
            name: new FormControl({ value: roughProductConfiguration.name, disabled: true }),
            quantity: new FormControl('', Validators.required),
            cost: new FormControl({ value: '', disabled: true })
        }));
    }

    deleteRoughProductFromAFiniteProduct(finiteProductForm: FormGroup, index: number) {
        (finiteProductForm.get('productDetails') as FormArray).removeAt(index);
    }

    updateFiniteProduct() {
        if (!this.finiteProductFormGroup.valid)
            return;

        const finiteProductConfiguration: FiniteProductConfiguration = {
            id: this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.id : Guid.newGuid(),
            projectID: this.projectID,
            name: this.finiteProductFormGroup.get('name').value,
            description: this.finiteProductFormGroup.get('description').value,
            cost: this.finiteProductFormGroup.get('cost').value,
            productDetails: (this.finiteProductFormGroup.get('productDetails') as FormArray).controls.map((fb: FormGroup) => {
                return {
                    roughProductID: fb.get('id').value,
                    name: fb.get('name').value,
                    quantity: fb.get('quantity').value,
                    cost: fb.get('cost').value
                } as ProductDetails
            })
        };

        this.projectCollectionConfigService.updateFiniteProductConfiguration(finiteProductConfiguration).subscribe(() => {
            this.loadConfiguration();
            this.expandFinalProducts = true;
            this.expandRoughProducts = false;
            this.expandRoughCollectionProducts = false;
            this.updatedFiniteProductConfiguration = null;
        });
    }

    private initRoughProductForm() {
        this.roughProductFormGroup = new FormGroup({
            name: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.name : '', Validators.required),
            description: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.description : ''),
            quantity: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.quantity : '', Validators.required),
            unitOfMeasure: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.unitOfMeasure : '', Validators.required),
            cost: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.cost : '', Validators.required),
            includeInCollection: new FormControl(this.updatedRoughProductConfiguration ? !!this.updatedRoughProductConfiguration.projectCollectionID : false),
        });

        if (this.roughProductFormDirective)
            this.roughProductFormDirective.resetForm();
    }

    private initFiniteProductForm() {
        this.finiteProductFormGroup = new FormGroup({
            name: new FormControl(this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.name : '', Validators.required),
            description: new FormControl(this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.description : ''),
            cost: new FormControl({ value: this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.description : '', disabled: true }),
            productDetails: new FormArray(this.initProductDetailsFormGroup(), Validators.required)
        });

        if (this.finiteProductFormDirective)
            this.finiteProductFormDirective.resetForm();
    }

    private initProductDetailsFormGroup(): FormGroup[] {
        let formGroups: FormGroup[] = [];

        if (this.updatedRoughProductConfiguration) {
            this.updatedFiniteProductConfiguration.productDetails.forEach((productDetail: ProductDetails) => {
                formGroups.push(new FormGroup({
                    id: new FormControl({ value: productDetail.roughProductID, hidden: true }),
                    name: new FormControl({ value: productDetail.name, disabled: true }),
                    quantity: new FormControl(productDetail.quantity, Validators.required),
                    cost: new FormControl({ value: productDetail.cost, disabled: true })
                }));
            });
        }

        return formGroups;
    }

    private loadConfiguration() {
        forkJoin(
            this.projectCollectionConfigService.listAllRoughProductConfigurationsByCollection(this.projectCollectionID),
            this.projectCollectionConfigService.listAllRoughProductConfigurationsByProject(this.projectID),
            this.projectCollectionConfigService.listAllFiniteProductConfigurationsByProject(this.projectID)
        ).subscribe((response: [RoughProductConfiguration[], RoughProductConfiguration[], FiniteProductConfiguration[]]) => {
            this.collectionRoughProductConfigurations = response[0];
            this.projectRoughProductConfigurations = response[1];
            this.projectFiniteProductConfigurations = response[2];

            this.initRoughProductForm();
            this.initFiniteProductForm();
        });
    }
}
