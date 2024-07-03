import { roleMap } from "src/app/helper/interface/user";

export const roleDto: roleMap = {
    staff: {
        LIST: true,
        MODIFY: true,
        DELETE: true,
        permission: { zone: ['0'], region: ['0'], department: ['0'], institution: ['0'], promotional_office: ['0'] },
    }
}