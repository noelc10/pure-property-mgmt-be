import { v4 as uuid } from 'uuid'
import { PropertyAgent } from '../models/PropertyAgent'

const agents: PropertyAgent[] = []

export const AgentStore = {
  all: () => agents,
  get: (id: string) => agents.find(a => a.id === id),
  create(data: Omit<PropertyAgent, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const agent: PropertyAgent = { id: uuid(), ...data, createdAt: now, updatedAt: now }
    agents.push(agent)
    return agent
  },
  update(id: string, data: Partial<PropertyAgent>) {
    const agent = agents.find(a => a.id === id)
    if (!agent) return null
    Object.assign(agent, data, { updatedAt: new Date().toISOString() })
    return agent
  },
  remove(id: string) {
    const index = agents.findIndex(a => a.id === id)
    if (index === -1) return false
    agents.splice(index, 1)
    return true
  }
}
