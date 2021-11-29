export interface ProjectCollectionConfiguration {
    id: string;
    name: string;
    description: string;
}

export interface ProjectConfiguration {
    id: string;
    projectCollectionID: string;
    name: string;
    description: string;
    closeDate: Date;
}

export interface RoughProductConfiguration {
    id: string;
    projectCollectionID: string;
    projectID: string;
    importedID: string;
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

export interface FiniteProductConfiguration {
    id: string;
    projectID: string;
    name: string;
    description: string;
    cost: number;
    productDetails: ProductDetails[];
}

export interface ProductDetails {
    roughProductID: string;
    name: string;
    cost: number;
    quantity: number;
}

export interface ProjectConfigurationDetails {
    id: string;
    projectCollectionID: string;
    roughProductDetails: RoughProductDetails[];
    totalCostPerQuantityNeeded: number;
    totalCostPerQuantityToBuy: number;
    totalCostPerRemainQuantity: number;
}

export interface RoughProductDetails {
    id: string;
    name: string;
    quantityNeeded: number;
    quantityToBuy: number;
    remainQuantity: number;
    costPerQuantityNeeded: number;
    costPerQuantityToBuy: number;
    costPerRemainQuantity: number;
}

export interface EarningsItem {
    id: string;
    details: string;
    date: Date;
    cost: number;
    projectID: string;
    projectCollectionID: string;
}

export interface InvestmentItem {
    id: string;
    name: string;
    description: string;
    date: Date;
    cost: number;
    projectID?: string;
    projectCollectionID?: string;
}

export interface CashFlowData {
    cashFlowDataByMonth: CashFlowDataByMonth[];
    cashFlow: number;
}

export interface CashFlowDataByMonth {
    startDate: Date;
    endDate: Date;
    name: string;
    earningsItems: EarningsItem[];
    investmentItems: InvestmentItem[];
    cashFlow: number;
}
