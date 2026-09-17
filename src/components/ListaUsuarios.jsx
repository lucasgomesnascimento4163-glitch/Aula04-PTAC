import { useEffect, useState } from 'react'

async function atualizarUsuario(id, novosDados) {
  const resp = await fetch(`https://typicode.com{id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novosDados),
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  return await resp.json()
}

async function excluirUsuario(id) {
  const resp = await fetch(`https://typicode.com{id}`, {
    method: 'DELETE',
  })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  return true
}

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    const controle = new AbortController()
    const signal = controle.signal

    async function buscar() {
      try {
        setCarregando(true)
        setErro(null)
        const resp = await fetch('https://jsonplaceholder.typicode.com/users', { signal })
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        const data = await resp.json()
        setUsuarios(data)
      } catch (e) {
        if (e.name !== 'AbortError') {
          setErro(e.message)
        }
      } finally {
        setCarregando(false)
      }
    }

    buscar()

    return () => controle.abort()
  }, [])

  async function tentarExcluir(id) {
    const prev = usuarios
    setUsuarios(prev.filter(u => u.id !== id))
    try {
      await excluirUsuario(id)
      console.log(`Usuário ${id} excluído.`)
    } catch (e) {
      setUsuarios(prev)
      setErro(e.message)
    }
  }

  async function tentarSalvar(e) {
    e.preventDefault()
    const prev = usuarios
    const id = editando.id
    const novosDados = {
      name: e.target.name.value,
      email: e.target.email.value
    }

    setEditando(null)

    try {
      const editado = await atualizarUsuario(id, novosDados)
      setUsuarios(prev => prev.map(u => u.id === editado.id ? editado : u))
    } catch (e) {
      setUsuarios(prev)
      setErro(e.message)
    }
  }

  if (carregando) return <p>Carregando...</p>
  if (erro)       return <p>Erro: {erro}</p>
  if (usuarios.length === 0) return <p>Nenhum usuário encontrado.</p>

  return (
    <div>
      {editando && (
        <form onSubmit={tentarSalvar}>
          <h3>Editar</h3>
          <input type="text" name="name" defaultValue={editando.name} required />
          <input type="email" name="email" defaultValue={editando.email} required />
          <button type="submit">Salvar</button>
          <button type="button" onClick={() => setEditando(null)}>Cancelar</button>
        </form>
      )}

      <ul>
        {usuarios.map((u) => (
          <li key={u.id}>
            {u.name}
            <button onClick={() => setEditando(u)}>Editar</button>
            <button onClick={() => tentarExcluir(u.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
