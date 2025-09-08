export const planosModel = {
  actionCollumn: [
    { name: 'actions', required: true, label: 'Opções', align: 'center', field: 'actions', sortable: false, style: 'width: 100px' }
  ],
  allColumns: [
    { name: 'planos_id', required: true, label: 'ID', align: 'left', field: obj => obj.planos_id, sortable: true },
    { name: 'planos_criado_em', required: true, label: 'Criado em', align: 'left', field: obj => obj.planos_criado_em, sortable: true },
    { name: 'planos_criado_por', required: true, label: 'Criado por', align: 'left', field: obj => obj.planos_criado_por, sortable: true },
    { name: 'planos_modificado_em', required: true, label: 'Modificado em', align: 'left', field: obj => obj.planos_modificado_em ? obj.planos_modificado_em : '-', sortable: true },
    { name: 'planos_modificado_por', required: true, label: 'Modificado por', align: 'left', field: obj => obj.planos_modificado_por ? obj.planos_modificado_por : '-', sortable: true },
    { name: 'planos_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => obj.planos_excluido_em ? obj.planos_excluido_em : '-', sortable: true },
    { name: 'planos_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.planos_excluido_por ? obj.planos_excluido_por : '-', sortable: true },
  ],
  commonCollumns: [
    { name: 'planos_id', required: true, label: 'ID', align: 'left', field: obj => obj.planos_id, sortable: true },
    { name: 'planos_nome', required: true, label: 'Plano', align: 'left', field: obj => obj.planos_nome, sortable: true },
    { name: 'planos_descricao', required: true, label: 'Descrição', align: 'left', field: obj => obj.planos_descricao ? obj.planos_descricao : '-', sortable: true, style: 'max-width: 500px; overflow: hidden; text-overflow: ellipsis;' },
    { name: 'planos_preco', required: true, label: 'Valor', align: 'left', field: obj => 'R$ ' + obj.planos_preco, sortable: true },
    { name: 'planos_ativo', required: true, label: 'Ativo', align: 'left', field: obj => obj.planos_ativo, sortable: true },
  ],
  trashCollumns: [
    { name: 'planos_id', required: true, label: 'ID', align: 'left', field: obj => obj.planos_id, sortable: true },
    { name: 'planos_nome', required: true, label: 'Plano', align: 'left', field: obj => obj.planos_nome, sortable: true },
    { name: 'planos_descricao', required: true, label: 'Descrição', align: 'left', field: obj => obj.planos_descricao ? obj.planos_descricao : '-', sortable: true, style: 'max-width: 500px; overflow: hidden; text-overflow: ellipsis;' },
    { name: 'planos_preco', required: true, label: 'Valor', align: 'left', field: obj => 'R$ ' + obj.planos_preco, sortable: true },
    { name: 'planos_ativo', required: true, label: 'Ativo', align: 'left', field: obj => obj.planos_ativo, sortable: true },
    { name: 'planos_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => obj.planos_excluido_em, sortable: true },
    { name: 'planos_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.planos_excluido_por ? obj.planos_excluido_por : '-', sortable: true }
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
