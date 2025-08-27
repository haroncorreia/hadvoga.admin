export const Rules = {

  required: (value) => !!value || 'Campo obrigatório',

  lengthEquals8: (value) => (value ? (value && value.length === 8) || 'Deve ter 8 caracteres' : true),
  lengthEquals10: (value) => (value ? (value && value.length === 10) || 'Deve ter 10 caracteres' : true),
  lengthEquals11: (value) => (value ? (value && value.length === 11) || 'Deve ter 11 caracteres' : true),
  lengthEquals14: (value) => (value ? (value && value.length === 14) || 'Deve ter 14 caracteres' : true),
  lengthEquals15: (value) => (value ? (value && value.length === 15) || 'Deve ter 15 caracteres' : true),

  minLength1: (value) => (value ? (value && value.length >= 1) || `Mínimo 1 caractere` : true),
  minLength3: (value) => (value ? (value && value.length >= 3) || `Mínimo 3 caracteres` : true),
  minLength10: (value) => (value ? (value && value.length >= 10) || `Mínimo 10 caracteres` : true),

  maxLength10: (value) => (value ? (value && value.length <= 10) || 'Máximo 10 caracteres' : true),
  maxLength15: (value) => (value ? (value && value.length <= 15) || 'Máximo 15 caracteres' : true),
  maxLength20: (value) => (value ? (value && value.length <= 20) || 'Máximo 20 caracteres' : true),
  maxLength100: (value) => (value ? (value && value.length <= 100) || `Máximo 100 caracteres` : true),
  maxLength255: (value) => (value ? (value && value.length <= 255) || `Máximo 255 caracteres` : true),
  maxLength500: (value) => (value ? (value && value.length <= 500) || `Máximo 500 caracteres` : true),

  email: (value) =>
    value ? !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'E-mail inválido' : true,

  cpf: (value) =>
    value ? !value || /^\d{11}$/.test(value) || 'CPF inválido' : true,

  cpfCnpj: (value) =>
    value ? !value || /^(?:\d{11}|\d{14})$/.test(value) || 'CPF ou CNPJ inválido' : true,

  cnpj: (value) =>
    value ? !value || /^\d{14}$/.test(value) || 'CNPJ inválido' : true,

  number: (value) =>
    value ? !value || /^\d+$/.test(value) || 'Apenas números são permitidos' : true,

  whatsapp: (value) =>
    value ? !value || /^\+?[1-9]\d{1,14}$/.test(value) || 'Número de WhatsApp inválido' : true,

  // Adicione mais regras conforme necessário
}

export default Rules;

