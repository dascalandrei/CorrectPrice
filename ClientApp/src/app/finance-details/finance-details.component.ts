import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { forkJoin } from 'rxjs';
import * as moment from 'moment';
import { ProjectCollectionConfigService } from '../core/services/project-collection-config.service';
import { InvestmentItem, EarningsItem, CashFlowData, ProjectCollectionConfiguration, ProjectConfiguration, CashFlowDataByMonth } from '../core/models/project-configuration.model';
import { FormGroup, NgForm, FormControl, Validators } from '@angular/forms';
import { Guid } from '../core/services/guid.service';

@Component({
    selector: 'finance-details',
    templateUrl: './finance-details.component.html',
    styleUrls: ['./finance-details.component.scss']
})
export class FinanceDetailsComponent implements OnInit {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('investmentItemFormDirective') private investmentItemFormDirective: NgForm;
    @ViewChild('earningsItemFormDirective') private earningsItemFormDirective: NgForm;
    @ViewChild('datePickerFormDirective') private datePickerFormDirective: NgForm;

    isLoaded: boolean;
    projectCollectionsConfiguration: ProjectCollectionConfiguration[];
    investmentProjects: ProjectConfiguration[];
    earningsProjects: ProjectConfiguration[];
    investmentItems: InvestmentItem[];
    updatedInvestmentItem: InvestmentItem;
    earningsItems: EarningsItem[];
    updatedEarningItem: EarningsItem;
    cashFlowData: CashFlowData;
    investmentItemFormGroup: FormGroup;
    earningsItemFormGroup: FormGroup;
    datePickerFormGroup: FormGroup;
    globalStartDate: Date;
    formattedGlobalStartDate: string;
    globalEndDate: Date;
    formattedGlobalEndDate: string;
    earningsCollectionMap: Map<string, string> = new Map<string, string>();
    earningsProjectMap: Map<string, string> = new Map<string, string>();
    dateMap: Map<string, string> = new Map<string, string>();

    constructor(
        private projectCollectionConfigService: ProjectCollectionConfigService) {
    }

    ngOnInit() {
        this.globalEndDate = new Date();
        this.globalStartDate = new Date(this.globalEndDate.getFullYear(), this.globalEndDate.getMonth(), 1);

        this.initDatePickerForm();

        this.loadConfiguration();
    }

    updateCashFlowData(startDate: Date, endDate: Date, allCollections: boolean, projectCollectionID: string) {
        this.globalStartDate = startDate;
        this.globalEndDate = endDate;

        if (allCollections)
            this.loadConfiguration();
        else
            this.loadConfiguration(projectCollectionID);
    }

    editInvestmentItem(investmentItem: InvestmentItem) {
        this.updatedInvestmentItem = investmentItem;

        this.initInvestmentItemForm();
    }

    editEarningsItem(earningsItem: EarningsItem) {
        this.updatedEarningItem = earningsItem;

        this.initEarningItemForm();
    }

    deleteInvestmentItem(investmentItem: InvestmentItem) {
        this.projectCollectionConfigService.deleteInvestmentItem(investmentItem.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    deleteEarningsItem(earningsItem: EarningsItem) {
        this.projectCollectionConfigService.deleteEarningsItem(earningsItem.id).subscribe(() => {
            this.loadConfiguration();
        });
    }

    updateInvestmentItem() {
        if (!this.investmentItemFormGroup.valid)
            return;

        const investmentItem: InvestmentItem = {
            id: this.updatedInvestmentItem ? this.updatedInvestmentItem.id : Guid.newGuid(),
            name: this.investmentItemFormGroup.get('name').value,
            description: this.investmentItemFormGroup.get('description').value,
            date: this.investmentItemFormGroup.get('date').value,
            cost: this.investmentItemFormGroup.get('cost').value,
            projectID: this.investmentItemFormGroup.get('projectID').value,
            projectCollectionID: this.investmentItemFormGroup.get('projectCollectionID').value,
        };

        this.projectCollectionConfigService.updateInvestmentsItem(investmentItem).subscribe(() => {
            this.updatedInvestmentItem = null;
            this.projectCollectionsConfiguration = null;
            this.investmentProjects = null;
            this.loadConfiguration();
        });
    }

    updateEarningsItem() {
        if (!this.earningsItemFormGroup.valid)
            return;

        const earningsItem: EarningsItem = {
            id: this.updatedEarningItem ? this.updatedEarningItem.id : Guid.newGuid(),
            details: this.earningsItemFormGroup.get('details').value,
            date: this.earningsItemFormGroup.get('date').value,
            cost: this.earningsItemFormGroup.get('cost').value,
            projectID: this.earningsItemFormGroup.get('projectID').value,
            projectCollectionID: this.earningsItemFormGroup.get('projectCollectionID').value,
        };

        this.projectCollectionConfigService.updateEarningsItem(earningsItem).subscribe(() => {
            this.updatedEarningItem = null;
            this.projectCollectionsConfiguration = null;
            this.earningsProjects = null;
            this.loadConfiguration();
        });
    }

    loadInvestmentProjects(projectCollectionID: string) {
        this.projectCollectionConfigService.listAllProjects(projectCollectionID).subscribe((projects: ProjectConfiguration[]) => {
            this.investmentProjects = projects;
        })
    }

    loadEarningsProjects(projectCollectionID: string) {
        this.projectCollectionConfigService.listAllProjects(projectCollectionID).subscribe((projects: ProjectConfiguration[]) => {
            this.earningsProjects = projects;
        })
    }

    resetInvestmentForm() {
        this.updatedInvestmentItem = null;
        this.initInvestmentItemForm();
    }

    resetEarningsForm() {
        this.updatedEarningItem = null;
        this.initEarningItemForm();
    }

    private loadConfiguration(projectCollectionID: string = null) {
        forkJoin(
            this.projectCollectionConfigService.listAllProjectCollections(),
            this.projectCollectionConfigService.listAllInvestments(this.globalStartDate, this.globalEndDate, projectCollectionID),
            this.projectCollectionConfigService.listAllEarnings(this.globalStartDate, this.globalEndDate, projectCollectionID),
            this.projectCollectionConfigService.detailCashFlowData(this.globalStartDate, this.globalEndDate, projectCollectionID)
        ).subscribe((response: [ProjectCollectionConfiguration[], InvestmentItem[], EarningsItem[], CashFlowData]) => {
            this.projectCollectionsConfiguration = response[0];
            this.investmentItems = response[1];
            this.earningsItems = response[2];
            this.cashFlowData = response[3];

            const projects: ProjectConfiguration[] = [];

            this.earningsItems.forEach((item: EarningsItem) => {
                const collection: ProjectCollectionConfiguration = this.projectCollectionsConfiguration.find(x => x.id === item.projectCollectionID);

                this.earningsCollectionMap.set(item.id, collection.name);

                const project: ProjectConfiguration = projects.find(x => x.id === item.projectID);

                if (project) {
                    this.earningsProjectMap.set(item.id, project.name);
                } else {
                    this.projectCollectionConfigService.listAllProjects(collection.id).subscribe((newProjects: ProjectConfiguration[]) => {
                        const newProject: ProjectConfiguration = newProjects.find(x => x.id === item.projectID);

                        this.earningsProjectMap.set(item.id, newProject.name);

                        projects.concat(newProjects);
                    });
                }

                this.dateMap.set(item.id, (moment(item.date)).format('DD-MMM-YYYY'));
            });

            this.investmentItems.forEach((x: InvestmentItem) => {
                this.dateMap.set(x.id, (moment(x.date)).format('DD-MMM-YYYY'));
            });

            this.cashFlowData.cashFlowDataByMonth.forEach((x: CashFlowDataByMonth) => {
                this.dateMap.set(x.name + '1', (moment(x.startDate)).format('DD-MMM-YYYY'));
                this.dateMap.set(x.name + '2', (moment(x.endDate)).format('DD-MMM-YYYY'));
            });

            this.formattedGlobalStartDate = (moment(this.globalStartDate)).format('DD-MMM-YYYY');
            this.formattedGlobalEndDate = (moment(this.globalEndDate)).format('DD-MMM-YYYY');

            this.initInvestmentItemForm();
            this.initEarningItemForm();
            
            this.isLoaded = true;
        });
    }

    private initInvestmentItemForm() {
        this.investmentItemFormGroup = new FormGroup({
            name: new FormControl(this.updatedInvestmentItem ? this.updatedInvestmentItem.name : '', Validators.required),
            description: new FormControl(this.updatedInvestmentItem ? this.updatedInvestmentItem.description : ''),
            date: new FormControl(this.updatedInvestmentItem ? this.updatedInvestmentItem.date : this.globalEndDate, Validators.required),
            cost: new FormControl(this.updatedInvestmentItem ? this.updatedInvestmentItem.cost : '', Validators.required),
            projectID: new FormControl(this.updatedInvestmentItem ? this.updatedInvestmentItem.projectID : null),
            projectCollectionID: new FormControl(this.updatedInvestmentItem ? this.updatedInvestmentItem.projectCollectionID : null)
        });

        if (this.investmentItemFormDirective)
            this.investmentItemFormDirective.resetForm();
    }

    private initEarningItemForm() {
        this.earningsItemFormGroup = new FormGroup({
            details: new FormControl(this.updatedEarningItem ? this.updatedEarningItem.details : ''),
            date: new FormControl(this.updatedEarningItem ? this.updatedEarningItem.date : this.globalEndDate, Validators.required),
            cost: new FormControl(this.updatedEarningItem ? this.updatedEarningItem.cost : '', Validators.required),
            projectID: new FormControl(this.updatedEarningItem ? this.updatedEarningItem.projectID : '', Validators.required),
            projectCollectionID: new FormControl(this.updatedEarningItem ? this.updatedEarningItem.projectCollectionID : '', Validators.required)
        });

        if (this.earningsItemFormDirective)
            this.earningsItemFormDirective.resetForm();
    }

    private initDatePickerForm() {
        this.datePickerFormGroup = new FormGroup({
            startDate: new FormControl(this.globalStartDate, Validators.required),
            endDate: new FormControl(this.globalEndDate, Validators.required),
            allCollections: new FormControl(true),
            projectCollectionID: new FormControl('')
        });

        this.datePickerFormGroup.get('projectCollectionID').disable();

        if (this.datePickerFormDirective)
            this.investmentItemFormDirective.resetForm();
    }
}
