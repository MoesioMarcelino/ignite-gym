export function formateDateTime(dateStr: string) {
  const dataUTC = new Date(dateStr + "Z");

  const horas = String(dataUTC.getHours()).padStart(2, "0");
  const minutos = String(dataUTC.getMinutes()).padStart(2, "0");

  return `${horas}:${minutos}`;
}
