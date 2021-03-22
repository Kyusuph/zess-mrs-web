export interface Case {
    id:string;
    caseNumber:string;
    date:string;
    patientId:string;
    complaints:string;
    notes:string;
    status:string;
    reported:string;
    franchise:string;
    customerId:string;
    userId:string;
    createdAt?:string;
    updatedAt?:string;
    deletedAt?:string
}