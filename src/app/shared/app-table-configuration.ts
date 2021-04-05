export interface TableConfiguration {
    tableColumns: { name: string, label: string }[];
    actionButtons?: { edit: boolean, delete: boolean, view: boolean, customButton: boolean };
}