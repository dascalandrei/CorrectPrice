import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectCollectionConfigService } from '../core/services/project-collection-config.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit, OnDestroy {
    collectionID: string;
    projectID: string;

    private collectionSelected: any;
    private projectSelected: any;

    constructor(
        private router: Router,
        private projectCollectionConfigService: ProjectCollectionConfigService) {
    }

    ngOnInit() {

        this.collectionSelected = this.projectCollectionConfigService.projectCollectionIDObservable.subscribe((collectionID: string) => {
            this.collectionID = collectionID;
        });

        this.projectSelected = this.projectCollectionConfigService.projectIDObservable.subscribe((projectID: string) => {
            this.projectID = projectID;
        });
    }

    ngOnDestroy(): void {
        this.collectionSelected.unsubscribe();
        this.projectSelected.unsubscribe();
    }

    isExpanded = false;

    collapse() {
        this.isExpanded = false;
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
    }

    redirectToCollection() {
        this.router.navigate(['/project-collection', this.collectionID]);
    }

    redirectToProject() {
        this.router.navigate(['/project-details', this.collectionID, this.projectID]);
    }
}
