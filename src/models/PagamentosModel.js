import { maskDataHoraBR } from "src/imports/MasksHandler";

export const pagamentosModel = {
  actionCollumn: [
    { name: 'actions', required: true, label: 'Opções', align: 'center', field: 'actions', sortable: false, style: 'width: 100px' }
  ],
  allColumns: [
    { name: 'pagamentos_id', required: true, label: 'ID', align: 'left', field: obj => obj.pagamentos_id, sortable: true },
    { name: 'pagamentos_criado_em', required: true, label: 'Criado em', align: 'left', field: obj => obj.pagamentos_criado_em, sortable: true },
    { name: 'pagamentos_criado_por', required: true, label: 'Criado por', align: 'left', field: obj => obj.pagamentos_criado_por, sortable: true },
    { name: 'pagamentos_modificado_em', required: true, label: 'Modificado em', align: 'left', field: obj => obj.pagamentos_modificado_em ? obj.pagamentos_modificado_em : '-', sortable: true },
    { name: 'pagamentos_modificado_por', required: true, label: 'Modificado por', align: 'left', field: obj => obj.pagamentos_modificado_por ? obj.pagamentos_modificado_por : '-', sortable: true },
    { name: 'pagamentos_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => obj.pagamentos_excluido_em ? obj.pagamentos_excluido_em : '-', sortable: true },
    { name: 'pagamentos_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.pagamentos_excluido_por ? obj.pagamentos_excluido_por : '-', sortable: true },
  ],
  commonCollumns: [
    { name: 'pagamentos_id', required: true, label: 'ID', align: 'left', field: obj => obj.pagamentos_id, sortable: true },
    {
      name: 'pagamentos_id_assinatura',
      required: true,
      label: 'Assinatura',
      align: 'left',
      field: obj => 'ID: ' + obj.pagamentos_id_assinatura + ' - ' + obj.usuarios_fk_nome + ' - Plano: ' + obj.planos_fk_nome,
      sortable: true
    },
    { name: 'pagamentos_data_hora', required: true, label: 'Data/hora', align: 'left', field: obj => maskDataHoraBR(obj.pagamentos_data_hora), sortable: true },
    { name: 'pagamentos_metodo', required: true, label: 'Método', align: 'left', field: obj => obj.pagamentos_metodo ? obj.pagamentos_metodo : '-', sortable: true },
    { name: 'pagamentos_valor', required: true, label: 'Valor', align: 'left', field: obj => 'R$ ' + obj.pagamentos_valor, sortable: true },
    { name: 'pagamentos_situacao', required: true, label: 'Situação', align: 'left', field: obj => obj.pagamentos_situacao, sortable: true },
  ],
  trashCollumns: [
    { name: 'pagamentos_id', required: true, label: 'ID', align: 'left', field: obj => obj.pagamentos_id, sortable: true },
    {
      name: 'pagamentos_id_assinatura',
      required: true,
      label: 'Assinatura',
      align: 'left',
      field: obj => 'ID: ' + obj.pagamentos_id_assinatura + ' - ' + obj.usuarios_fk_nome + ' - Plano: ' + obj.planos_fk_nome,
      sortable: true
    },    { name: 'pagamentos_data_hora', required: true, label: 'Data/hora', align: 'left', field: obj => obj.pagamentos_data_hora, sortable: true },
    { name: 'pagamentos_metodo', required: true, label: 'Método', align: 'left', field: obj => obj.pagamentos_metodo ? obj.pagamentos_metodo : '-', sortable: true },
    { name: 'pagamentos_valor', required: true, label: 'Valor', align: 'left', field: obj => 'R$ ' + obj.pagamentos_valor, sortable: true },
    { name: 'pagamentos_situacao', required: true, label: 'Situação', align: 'left', field: obj => obj.pagamentos_situacao, sortable: true },
    { name: 'pagamentos_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => obj.pagamentos_excluido_em, sortable: true },
    { name: 'pagamentos_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.pagamentos_excluido_por ? obj.pagamentos_excluido_por : '-', sortable: true }
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
