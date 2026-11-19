import { describe, it, expect } from 'vitest'
import { filtrarMaiores18 } from './filtrar-maiores-18'

describe('filtrarMaiores18', () => {
  it('mantém Ana e Carla e deixa Beto de fora', () => {
    const ana = { name: 'Ana', age: 22 }
    const beto = { name: 'Beto', age: 17 }
    const carla = { name: 'Carla', age: 30 }

    expect(filtrarMaiores18([ana, beto, carla])).toEqual([ana, carla])
  })

  it('conta 18 anos como maior de idade', () => {
    const davi = { name: 'Davi', age: 18 }

    expect(filtrarMaiores18([davi])).toEqual([davi])
  })
})
