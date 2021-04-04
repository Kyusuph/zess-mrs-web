export interface User {
    id: string;
    firstName: string;
    middlename?: string;
    surname?: string;
    email?: string;
    phoneNumber?: string;
    username?:string,
    gender?: string;
    name?:string;
    userCredentials: {
        id: string,
        userInfo: {
            id: String,
        },
        username: string;
        password?: string;
        userRoles?: any[]
    },
    organisationUnits: { id: string }[],
    userGroups?: any[]
}