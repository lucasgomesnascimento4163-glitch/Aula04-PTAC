export function media(notas) {
  if (notas.length === 0) {
    throw new Error('Lista vazia')
  }
  return notas.reduce((total, nota) => total + nota, 0) / notas.length
}
