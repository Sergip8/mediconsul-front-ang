import { TableColumn } from "../../shared/components/table/table.component";

export const userColumns: TableColumn[] = [
    { header: 'User ID', field: 'id', sortable: true, width: 'w-1/12' },
    { header: 'Email', field: 'email', sortable: true, width: 'w-2/12' },
    { header: 'IsActive', field: 'is_active', type: "bool", sortable: false, width: 'w-2/12' },
    { header: 'Roles', field: 'roles', sortable: true, width: 'w-2/12' },
    { header: 'Action', field: 'action',type: "action", sortable: false, width: 'w-2/12' },

  ];
  