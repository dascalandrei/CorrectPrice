export interface ProjectCollectionConfiguration {
    id: string;
    clientID: string;
    name: string;
    description: string;
}

export interface ProjectConfiguration {
    id: string;
    projectCollectionID: string;
    name: string;
    description: string;
}

export interface RoughProductConfiguration {
    id: string;
    projectCollectionID: string;
    projectID: string;
    effectiveDate: Date,
    name: string;
    description: string;
    quantity: number;
    unitOfMeasure: UnitOfMeasure;
    cost: number;
}

export enum UnitOfMeasure {
    None = 0,
    Buc = 1,
    Gram = 22,
    Kg = 24,
}
