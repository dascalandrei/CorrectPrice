import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatAccordion } from '@angular/material/expansion';
import { FormGroup, FormControl, Validators, NgForm, FormArray } from '@angular/forms';
import { Guid } from '../core/services/guid.service';
import { forkJoin } from 'rxjs';

import { RoughProductConfiguration, UnitOfMeasure, FiniteProductConfiguration, ProductDetails, ProjectConfiguration, ProjectConfigurationDetails } from '../core/models/project-configuration.model';
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
    @ViewChild('closeProjectFormDirective') private closeProjectFormDirective: NgForm;

    isLoaded: boolean;
    projectConfiguration: ProjectConfiguration;
    projectDetails: ProjectConfigurationDetails;
    collectionRoughProductConfigurations: RoughProductConfiguration[];
    projectRoughProductConfigurations: RoughProductConfiguration[];
    projectFiniteProductConfigurations: FiniteProductConfiguration[];
    unitOfMeasureValues: string[];
    roughProductFormGroup: FormGroup;
    finiteProductFormGroup: FormGroup;
    closeProjectFormGroup: FormGroup;
    expandFinalProducts: boolean;
    expandRoughProducts: boolean;
    expandRoughCollectionProducts: boolean;
    updatedRoughProductConfiguration: RoughProductConfiguration;
    updatedFiniteProductConfiguration: FiniteProductConfiguration;
    isUpdateFiniteProduct: boolean = false;
    isProductImported: Map<string, boolean> = new Map<string, boolean>();
    isCostCalculatedForFiniteProduct: boolean = false;
    unitOfMeasures = UnitOfMeasure;
    displayedColumns1Map: Map<string, string> = new Map<string, string>();
    displayedColumns1: string[] = ['name', 'quantityToBuy', 'quantityNeeded', 'remainQuantity'];
    displayedColumns2: string[] = ['name', 'quantityToBuy', 'costPerQuantityToBuy', 'quantityNeeded', 'costPerQuantityNeeded', 'remainQuantity', 'costPerRemainQuantity'];
    columns1ToDisplay: string[];

    private projectCollectionID: string;
    private projectID: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private projectCollectionConfigService: ProjectCollectionConfigService) {
    }

    ngOnInit() {
        this.projectCollectionID = this.route.snapshot.paramMap.get('collectionID');
        this.projectID = this.route.snapshot.paramMap.get('projectID');

        this.expandFinalProducts = true;
        this.expandRoughProducts = false;
        this.expandRoughCollectionProducts = false;
        this.unitOfMeasureValues = Object.keys(this.unitOfMeasures).filter(k => !isNaN(Number(k)));

        this.columns1ToDisplay = this.displayedColumns1.slice();
        this.displayedColumns1Map.set('name', 'Nume produs');
        this.displayedColumns1Map.set('quantityToBuy', 'Cantitatea de cumparat');
        this.displayedColumns1Map.set('quantityNeeded', 'Cantitatea necesara');
        this.displayedColumns1Map.set('remainQuantity', 'Cantitatea ramasa');

        this.loadConfiguration();
    }

    importRoughProductAtProject(roughProductConfiguration: RoughProductConfiguration) {
        roughProductConfiguration.importedID = roughProductConfiguration.id;
        roughProductConfiguration.id = roughProductConfiguration.id;
        roughProductConfiguration.projectCollectionID = null;
        roughProductConfiguration.projectID = this.projectID;

        this.projectCollectionConfigService.updateRoughProductConfiguration(roughProductConfiguration).subscribe(() => {
            this.loadConfiguration();
            this.expandFinalProducts = false;
            this.expandRoughProducts = true;
            this.expandRoughCollectionProducts = false;
        });
    }

    editRoughProductAtProject(roughProductConfiguration: RoughProductConfiguration) {
        this.updatedRoughProductConfiguration = roughProductConfiguration;

        console.log(roughProductConfiguration.importedID);

        this.initRoughProductForm();
    }

    updateRoughProduct() {
        if (!this.roughProductFormGroup.valid)
            return;

        const id: string = this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.id : Guid.newGuid();

        const includeInCollection: boolean = this.roughProductFormGroup.get('includeInCollection').value;

        const importedID: string = includeInCollection ? id : null;

        const roughProductConfiguration: RoughProductConfiguration = {
            id: id,
            name: this.roughProductFormGroup.get('name').value,
            description: this.roughProductFormGroup.get('description').value,
            quantity: this.roughProductFormGroup.get('quantity').value,
            unitOfMeasure: Number(this.roughProductFormGroup.get('unitOfMeasure').value),
            cost: this.roughProductFormGroup.get('cost').value,
            effectiveDate: new Date(),
            projectID: this.projectID,
            projectCollectionID: includeInCollection && !this.updatedRoughProductConfiguration ? this.projectCollectionID : null,
            importedID: importedID,
        };

        this.projectCollectionConfigService.updateRoughProductConfiguration(roughProductConfiguration).subscribe(() => {
            this.loadConfiguration();
            this.expandFinalProducts = false;
            this.expandRoughProducts = true;
            this.expandRoughCollectionProducts = false;
            this.updatedRoughProductConfiguration = null;
        });
    }

    deleteRoughProductAtProject(roughProductConfiguration: RoughProductConfiguration) {
        this.projectCollectionConfigService.deleteRoughProductConfiguration(roughProductConfiguration.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    editFiniteProductAtProject(finiteProductConfiguration: FiniteProductConfiguration) {
        this.updatedFiniteProductConfiguration = finiteProductConfiguration;
        this.isUpdateFiniteProduct = true;

        this.initFiniteProductForm();
    }

    addNewRoughProductToAFiniteProduct() {
        (this.finiteProductFormGroup.controls.productDetails as FormArray).push(new FormGroup({
            id: new FormControl('', Validators.required),
            name: new FormControl({ value: '', disabled: true }),
            quantity: new FormControl('', Validators.required),
            cost: new FormControl({ value: '', disabled: true })
        }));

        this.isCostCalculatedForFiniteProduct = false;
    }

    deleteFiniteProductAtProject(finiteProductConfiguration: FiniteProductConfiguration) {
        this.projectCollectionConfigService.deleteFiniteProductConfiguration(finiteProductConfiguration.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    deleteRoughProductFromAFiniteProduct(index: number) {
        this.isCostCalculatedForFiniteProduct = false;
        (this.finiteProductFormGroup.controls.productDetails as FormArray).removeAt(index);
    }

    changeRoughProductDetails() {
        this.isCostCalculatedForFiniteProduct = false;
    }

    calculateCostForFiniteProduct() {
        if (!this.finiteProductFormGroup.valid)
            return;

        const finiteProductConfiguration: FiniteProductConfiguration = {
            id: this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.id : Guid.newGuid(),
            projectID: this.projectID,
            name: this.finiteProductFormGroup.get('name').value,
            description: this.finiteProductFormGroup.get('description').value,
            cost: 0,
            productDetails: (this.finiteProductFormGroup.get('productDetails') as FormArray).controls.map((fb: FormGroup) => {
                return {
                    roughProductID: fb.get('id').value,
                    name: this.projectRoughProductConfigurations.find(x => x.id === fb.get('id').value).name,
                    quantity: fb.get('quantity').value,
                    cost: 0
                } as ProductDetails
            })
        };

        this.projectCollectionConfigService.calculateFiniteProductCosts(finiteProductConfiguration).subscribe((finiteProductConfigurationWithCosts: FiniteProductConfiguration) => {
            this.updatedFiniteProductConfiguration = finiteProductConfigurationWithCosts;
            this.isCostCalculatedForFiniteProduct = true;

            this.initFiniteProductForm();
        });
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
            this.isUpdateFiniteProduct = false;
            this.updatedFiniteProductConfiguration = null;
        });
    }

    addColumn() {
        if (this.columns1ToDisplay.length < this.displayedColumns1.length)
            this.columns1ToDisplay.push(this.displayedColumns1[this.columns1ToDisplay.length]);
    }

    removeColumn() {
        if (this.columns1ToDisplay.length)
            this.columns1ToDisplay.pop();
    }

    closeProject() {
        this.projectCollectionConfigService.closeProject(this.projectID, this.closeProjectFormGroup.get('closeDate').value, this.closeProjectFormGroup.get('earnings').value).subscribe(() => {
            this.router.navigate(['/project-collection', this.projectCollectionID]);
        });
    }

    private loadConfiguration() {
        forkJoin(
            this.projectCollectionConfigService.listAllProjects(this.projectCollectionID),
            this.projectCollectionConfigService.listAllRoughProductConfigurationsByCollection(this.projectCollectionID),
            this.projectCollectionConfigService.listAllRoughProductConfigurationsByProject(this.projectID),
            this.projectCollectionConfigService.listAllFiniteProductConfigurationsByProject(this.projectID),
            this.projectCollectionConfigService.detailProjectConfigurationDetails(this.projectID)
        ).subscribe((response: [ProjectConfiguration[], RoughProductConfiguration[], RoughProductConfiguration[], FiniteProductConfiguration[], ProjectConfigurationDetails]) => {
            this.projectConfiguration = response[0].find(x => x.id === this.projectID);
            this.collectionRoughProductConfigurations = response[1];
            this.projectRoughProductConfigurations = response[2];
            this.projectFiniteProductConfigurations = response[3];
            this.projectDetails = response[4];

            this.initRoughProductForm();
            this.initFiniteProductForm();
            this.initCloseProjectForm();

            this.collectionRoughProductConfigurations.forEach((collectionProduct: RoughProductConfiguration) => {
                const isImported = this.projectRoughProductConfigurations.some(x => x.importedID === collectionProduct.id);
                this.isProductImported.set(collectionProduct.id, isImported);
            })

            this.isLoaded = true;
        });
    }

    resetRoughProductForm() {
        this.updatedRoughProductConfiguration = null;
        this.initRoughProductForm();
    }

    private initRoughProductForm() {
        this.roughProductFormGroup = new FormGroup({
            name: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.name : '', Validators.required),
            description: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.description : ''),
            quantity: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.quantity : '', Validators.required),
            unitOfMeasure: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.unitOfMeasure : '', Validators.required),
            cost: new FormControl(this.updatedRoughProductConfiguration ? this.updatedRoughProductConfiguration.cost : '', Validators.required),
            includeInCollection: new FormControl(this.updatedRoughProductConfiguration ? !!this.updatedRoughProductConfiguration.importedID : false),
        });

        if (this.roughProductFormDirective)
            this.roughProductFormDirective.resetForm();
    }

    private initFiniteProductForm() {
        this.finiteProductFormGroup = new FormGroup({
            name: new FormControl(this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.name : '', Validators.required),
            description: new FormControl(this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.description : ''),
            cost: new FormControl({ value: this.updatedFiniteProductConfiguration ? this.updatedFiniteProductConfiguration.cost : '', disabled: true }),
            productDetails: new FormArray(this.initProductDetailsFormGroup(), Validators.required)
        });

        if (this.finiteProductFormDirective) {
            this.finiteProductFormDirective.resetForm();
        }

    }

    private initProductDetailsFormGroup(): FormGroup[] {
        let formGroups: FormGroup[] = [];

        if (this.updatedFiniteProductConfiguration) {
            this.updatedFiniteProductConfiguration.productDetails.forEach((productDetail: ProductDetails) => {
                formGroups.push(new FormGroup({
                    id: new FormControl(productDetail.roughProductID, Validators.required),
                    name: new FormControl({ value: productDetail.name, disabled: true }),
                    quantity: new FormControl(productDetail.quantity, Validators.required),
                    cost: new FormControl({ value: productDetail.cost, disabled: true })
                }));
            });
        } else {
            formGroups.push(new FormGroup({
                id: new FormControl('', Validators.required),
                name: new FormControl({ value: '', disabled: true }),
                quantity: new FormControl('', Validators.required),
                cost: new FormControl({ value: '', disabled: true })
            }));
        }

        return formGroups;
    }

    private initCloseProjectForm() {
        this.closeProjectFormGroup = new FormGroup({
            closeDate: new FormControl({ value: this.projectConfiguration.closeDate ? this.projectConfiguration.closeDate : new Date(), disabled: this.projectConfiguration.closeDate }, Validators.required),
            earnings: new FormControl({ value: '', disabled: this.projectConfiguration.closeDate }, Validators.required)
        });

        if (this.closeProjectFormDirective)
            this.closeProjectFormDirective.resetForm();
    }
}
