export function filtrarMaiores18(usuarios) {
  return usuarios.filter((usuario) => usuario.age >= 18)
}
