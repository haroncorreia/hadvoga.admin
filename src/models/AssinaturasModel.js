import { maskDataHoraBR } from "src/imports/MasksHandler";
import { calcularPrazo } from "src/imports/FunctionsHandler";

export const assinaturasModel = {
  actionCollumn: [
    { name: 'actions', required: true, label: 'Opções', align: 'center', field: 'actions', sortable: false, style: 'width: 100px' }
  ],
  allColumns: [
    { name: 'assinaturas_id', required: true, label: 'ID', align: 'left', field: obj => obj.assinaturas_id, sortable: true },
    { name: 'assinaturas_criado_em', required: true, label: 'Criado em', align: 'left', field: obj => obj.assinaturas_criado_em, sortable: true },
    { name: 'assinaturas_criado_por', required: true, label: 'Criado por', align: 'left', field: obj => obj.assinaturas_criado_por, sortable: true },
    { name: 'assinaturas_modificado_em', required: true, label: 'Modificado em', align: 'left', field: obj => obj.assinaturas_modificado_em ? obj.assinaturas_modificado_em : '-', sortable: true },
    { name: 'assinaturas_modificado_por', required: true, label: 'Modificado por', align: 'left', field: obj => obj.assinaturas_modificado_por ? obj.assinaturas_modificado_por : '-', sortable: true },
    { name: 'assinaturas_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => obj.assinaturas_excluido_em ? obj.assinaturas_excluido_em : '-', sortable: true },
    { name: 'assinaturas_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.assinaturas_excluido_por ? obj.assinaturas_excluido_por : '-', sortable: true },
  ],
  commonCollumns: [
    { name: 'assinaturas_id', required: true, label: 'ID', align: 'left', field: obj => obj.assinaturas_id, sortable: true },
    { name: 'usuarios_fk_nome', required: true, label: 'Assinante', align: 'left', field: obj => obj.usuarios_fk_nome, sortable: true },
    { name: 'planos_fk_nome', required: true, label: 'Plano', align: 'left', field: obj => obj.planos_fk_nome, sortable: true },
    { name: 'planos_fk_preco', required: true, label: 'Valor', align: 'left', field: obj => 'R$ ' + obj.planos_fk_preco, sortable: true },
    { name: 'assinaturas_situacao', required: true, label: 'Situação', align: 'left', field: obj => obj.assinaturas_situacao, sortable: true },
    { name: 'assinaturas_data_inicio', required: true, label: 'Início da assinatura', align: 'left', field: obj => maskDataHoraBR(obj.assinaturas_data_inicio), sortable: true },
    { name: 'assinaturas_data_fim', required: true, label: 'Fim da assinatura', align: 'left', field: obj => maskDataHoraBR(obj.assinaturas_data_fim), sortable: true },
    { name: 'assinaturas_prazo', required: true, label: 'Expira em', align: 'left', field: obj => calcularPrazo(obj.assinaturas_data_fim), sortable: true },
    { name: 'assinaturas_observacoes', required: true, label: 'Observações', align: 'left', field: obj => obj.assinaturas_observacoes ? obj.assinaturas_observacoes : '-', sortable: true },
  ],
  trashCollumns: [
    { name: 'assinaturas_id', required: true, label: 'ID', align: 'left', field: obj => obj.assinaturas_id, sortable: true },
    { name: 'usuarios_fk_nome', required: true, label: 'Assinante', align: 'left', field: obj => obj.usuarios_fk_nome, sortable: true },
    { name: 'planos_fk_nome', required: true, label: 'Plano', align: 'left', field: obj => obj.planos_fk_nome, sortable: true },
    { name: 'assinaturas_descricao', required: true, label: 'Descrição', align: 'left', field: obj => obj.assinaturas_descricao ? obj.assinaturas_descricao : '-', sortable: true, style: 'max-width: 500px; overflow: hidden; text-overflow: ellipsis;' },
    { name: 'assinaturas_excluido_em', required: true, label: 'Excluído em', align: 'left', field: obj => obj.assinaturas_excluido_em, sortable: true },
    { name: 'assinaturas_excluido_por', required: true, label: 'Excluído por', align: 'left', field: obj => obj.assinaturas_excluido_por ? obj.assinaturas_excluido_por : '-', sortable: true }
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
