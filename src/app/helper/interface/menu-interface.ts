import { userPermission } from "./user";

export interface menuItem {
    title: string;
    icon?: string;
    link?: string;
    queryParams?: { id: any };
    data?: menuData;
    condition?: 'NOT' | 'EQUAL';
}
export interface menu extends menuItem {
    children?: menuItem[]
}
export interface menuData {
    permission: userPermission
}

export interface pageInfo {
    buttonShowBtn?: boolean,
    title: string,
    button?: btn[] | btn,
    info_text?: string
}
interface btn {
    url: string,
    title: string
    icon?: string,
    class?: string
    queryParams?: any
}