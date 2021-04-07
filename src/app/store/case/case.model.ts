export interface Case {
    id:string;
    case_number:string;
    case_date:string;
    patient_id:string;
    patient_name?:string;
    complaints:string;
    notes:string;
    status:string;
    reported?:string;
    franchise:string;
    customer_id:string;
    user_id:string;
    created_at?:string;
    updated_at?:string;
    deleted_at?:string
    measurements?: {[id: string]: number};
}
