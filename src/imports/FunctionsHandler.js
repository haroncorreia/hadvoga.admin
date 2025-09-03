function calcularPrazo(dataHora) {
  const agora = new Date();
  const alvo = new Date(dataHora);

  // Zera as horas para considerar apenas dias completos
  agora.setHours(0, 0, 0, 0);
  alvo.setHours(0, 0, 0, 0);

  const diffMs = alvo - agora;
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDias;
}

const getBgFieldColor = (action) => {
  return (
    action === 'view' ||
    action === 'remove' ||
    action === 'restore' ||
    action === 'destroy' ||
    action === 'updateRole'
  ) ? 'white' : 'grey-2'
}

import { api } from "src/boot/axios";
import { ResponseHandler } from "./ResponseHandler";

async function loadSelect(routeUri, idFieldName, firstLabelFieldName, secondLabelFieldName) {
  try {
    let ret = [];
    const { data } = await api.get(routeUri);
    data.forEach((item) => {
      ret.push({ id: item[idFieldName], nome: secondLabelFieldName ? `${item[firstLabelFieldName]} - ${item[secondLabelFieldName]}` : item[firstLabelFieldName] })
    })
    return ret;
  } catch (error) {
    ResponseHandler(error);
  }
}

function filterSelect(val, update, abort, objectOptions, objectOptionsFiltered, minCharLengthFilter) {
  if (minCharLengthFilter) {
    if (val.length < minCharLengthFilter) {
      abort()
      return
    }
  }
  if (val.length < 1 && val !== '') {
    abort()
    return
  }
  // Update no filtro
  update(() => {
    const needle = val.toLowerCase()
    objectOptions.value = objectOptionsFiltered.filter(v => {
      return v.nome.toLowerCase().indexOf(needle) > -1
    })
  })
}

export { calcularPrazo, getBgFieldColor, filterSelect, loadSelect };
