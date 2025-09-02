import { notify } from "./NotifyHandler"

export const ResponseHandler = (response) => {
  if (!response || !response.status) {
    notify.error('Erro na requisição. Resposta inválida.');
    return;
  }

  // Success responses
  // 200: OK, 201: Created, 204: No Content
  if (response.status === 200 || response.status === 201 || response.status === 204) {
    notify.success(response.data.message || 'Operação realizada com sucesso.');
    return;
  }

  // Error responses
  // 400: Bad Request, 401: Unauthorized, 404: Not Found, 500: Internal Server Error
  if (response.status === 400) {

    // Notificando erros gerados na biblioteca express-validator
    if (response.data && response.data.errors && typeof response.data.errors === 'object') {
      // Flatten the errors and notify each one
      const errors = Object.values(response.data.errors).flat();
      // Notify each error message
      if (errors.length > 0) errors.forEach(element => notify.error(element.msg));
      return;
    }

    // Fallback for other 400 errors
    if (response.data && response.data.message) {
      notify.error(response.data.message);
      return;
    }

    console.log(response)
    // Fallback for generic 400 errors
    notify.error('Erro 400 ainda não tratado no arquivo ResponseHandler.js.');
    return;

  } else if (response.status === 401) {
    notify.error('Não autorizado. Por favor, faça login novamente.');
  } else if (response.status === 403) {
    if (response.data.errors && response.data.errors[0].type === 'unknown_fields') {
      notify.error('Parâmetros não permitidos (403).');
      return;
    }
    notify.error('Não permitido (403).');
  } else if (response.status === 404) {
    notify.error('Não encontrado (404).');
  } else if (response.status === 500) {
    notify.error('Erro interno do servidor (500). Tente novamente mais tarde.');
  } else {
    notify.error(`Erro ao realizar a operação: ${response.data.message || response.statusText}`);
  }
}
