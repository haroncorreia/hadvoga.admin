import { maskDataHoraBR } from "src/imports/MasksHandler";

export const usuariosModel = {
  actionCollumn: [
    { name: 'actions', required: true, label: 'Opções', align: 'center', field: 'actions', sortable: false, style: 'width: 100px' }
  ],
  allColumns: [
    { name: 'usuarios_id', required: true, label: 'ID', align: 'left', field: obj => obj.usuarios_id, sortable: true },
    { name: 'usuarios_criado_em', required: true, label: 'Criado em', align: 'left', field: obj => maskDataHoraBR(obj.usuarios_criado_em), sortable: true },
    { name: 'usuarios_criado_por', required: true, label: 'Criado por', align: 'left', field: obj => obj.usuarios_criado_por ? obj.usuarios_criado_por : '-', sortable: true },
    { name: 'usuarios_modificado_em', required: true, label: 'Modificado em', align: 'left', field: obj => maskDataHoraBR(obj.usuarios_modificado_em), sortable: true },
    { name: 'usuarios_modificado_por', required: true, label: 'Modificado por', align: 'left', field: obj => obj.usuarios_modificado_por ? obj.usuarios_modificado_por : '-', sortable: true },
    { name: 'usuarios_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => maskDataHoraBR(obj.usuarios_excluido_em), sortable: true },
    { name: 'usuarios_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.usuarios_excluido_por ? obj.usuarios_excluido_por : '-', sortable: true },
  ],
  commonCollumns: [
    { name: 'usuarios_id', required: true, label: 'ID', align: 'left', field: obj => obj.usuarios_id, sortable: true },
    { name: 'usuarios_nome', required: true, label: 'Nome', align: 'left', field: obj => obj.usuarios_nome, sortable: true },
    { name: 'usuarios_cpf', required: true, label: 'CPF', align: 'left', field: obj => obj.usuarios_cpf, sortable: true },
    { name: 'usuarios_email', required: true, label: 'E-mail', align: 'left', field: obj => obj.usuarios_email, sortable: true },
    { name: 'usuarios_perfil', required: true, label: 'Perfil', align: 'left', field: obj => obj.usuarios_perfil, sortable: true },
    { name: 'usuarios_habilitado', required: true, label: 'Habilitado', align: 'left', field: obj => obj.usuarios_habilitado === 1 ? 'Sim' : 'Não', sortable: true },
    { name: 'usuarios_criado_em', required: true, label: 'Criado em', align: 'left', field: obj => maskDataHoraBR(obj.usuarios_criado_em), sortable: true },
  ],
  trashCollumns: [
    { name: 'usuarios_id', required: true, label: 'ID', align: 'left', field: obj => obj.usuarios_id, sortable: true },
    { name: 'usuarios_nome', required: true, label: 'Nome', align: 'left', field: obj => obj.usuarios_nome, sortable: true },
    { name: 'usuarios_cpf', required: true, label: 'CPF', align: 'left', field: obj => obj.usuarios_cpf, sortable: true },
    { name: 'usuarios_email', required: true, label: 'E-mail', align: 'left', field: obj => obj.usuarios_email, sortable: true },
    { name: 'usuarios_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => maskDataHoraBR(obj.usuarios_excluido_em), sortable: true },
    { name: 'usuarios_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.usuarios_excluido_por ? obj.usuarios_excluido_por : '-', sortable: true }
  ],

  getAllColumns() {
    return [
      ...this.allColumns,
      ...this.actionCollumn
    ];
  },
  getCommonColumns() {
    return [
      ...this.commonCollumns,
      ...this.actionCollumn
    ];
  },
  getTrashColumns() {
    return [
      ...this.trashCollumns,
      ...this.actionCollumn
    ];
  }
};
