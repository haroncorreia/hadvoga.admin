
function maskDataHoraBR(date) {
  if (!date) return '-';
  const d = new Date(date);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}h`;
}

function maskCpfCnpj(value) {
  if (!value) return '-';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11) {
    // CPF: 000.000.000-00
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
  }
  if (digits.length === 14) {
    // CNPJ: 00.000.000/0000-00
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12, 14)}`;
  }
  return value;
}

function maskCelularTelefone(value) {
  if (!value) return '-';
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  // Apply mask: +XX (XX) XXXXX-XXXX
  if (digits.length === 13) {
    return `+${digits.slice(0, 2)} (${digits.slice(2, 4)}) ${digits.slice(4, 9)}-${digits.slice(9, 13)}`;
  }
  // Apply mask: (XX) XXXXX-XXXX
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
  // Apply mask: (XX) XXXX-XXXX
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6, 10)}`;
  }
  // Apply mask: XXXXX-XXXX
  if (digits.length === 9) {
    return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
  }
  // Apply mask: XXXX-XXXX
  if (digits.length === 8) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
  }
  // Fallback for unexpected formats
  return value;
}

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}h`;
}

const formatDateOnly = (date) => {
  if (!date) return '-';
  // Espera-se que a data venha no formato 'YYYY-MM-DD' ou similar
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    const [year, month, day] = date.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  }
  // Fallback para outros formatos
  return date;
}

const maskCep = (value) => {
  if (!value) return '-';
  const digits = value.toString().replace(/\D/g, '');
  if (digits.length === 8) {
    // CEP: 00000-000
    return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
  }
  return value;
}

const maskNullable = (value) => {
  if (!value) return '-';
  return value;
}

const maskNumeroCNJ = (value) => {
  if (!value) return '-';
  const digits = value.toString().replace(/\D/g, '');
  if (digits.length === 20) {
    // CNJ: 0000012-01.2020.82.60100
    return `${digits.slice(0, 7)}-${digits.slice(7, 9)}.${digits.slice(9, 13)}.${digits.slice(13, 15)}.${digits.slice(15, 20)}`;
  }
  return value;
}

export { maskDataHoraBR, maskCpfCnpj, maskCelularTelefone, formatDate, formatDateOnly, maskCep, maskNullable, maskNumeroCNJ };
