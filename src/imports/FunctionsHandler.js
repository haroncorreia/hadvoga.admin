function calcularPrazo(inicio, fim) {
  // inicio e fim: strings no formato "DD/MM/YYYYTHH:ii"
  function parseDate(str) {
    if (!str || typeof str !== 'string' || !str.includes('T')) return null;
    const [datePart, timePart] = str.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    if (!timePart) return null;
    const [hour, minute, second = 0] = timePart.split(':').map(Number);
    if ([day, month, year, hour, minute].some(isNaN)) return null;
    return new Date(year, month - 1, day, hour, minute, second);
  }

  const dataInicio = parseDate(inicio);
  const dataFim = parseDate(fim);

  const diffMs = dataFim - dataInicio;
  if (isNaN(diffMs)) return null;

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  return { dias: diffDays, horas: diffHours, minutos: diffMinutes };
}
export { calcularPrazo };
