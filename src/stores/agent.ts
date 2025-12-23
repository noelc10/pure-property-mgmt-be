import { v4 as uuid } from 'uuid'
import { PropertyAgent } from '../models/PropertyAgent'

const agents: PropertyAgent[] = []

export const AgentStore = {
  all: () => agents,
  get: (id: string) => agents.find(a => a.id === id),
  createOrUpdate(data: Partial<Omit<PropertyAgent, 'createdAt' | 'updatedAt'>> & { id?: string }) {
    const now = new Date().toISOString()
    let agent: PropertyAgent | undefined

    if (data.id) {
      agent = agents.find(a => a.id === data.id)
    }

    if (!agent && data.email) {
      agent = agents.find(a => a.email === data.email)
    }

    if (agent) {
      Object.assign(agent, data, { updatedAt: now })
      
      return agent
    }

    agent = {
      id: uuid(),
      firstName: data.firstName!,
      lastName: data.lastName!,
      email: data.email!,
      mobileNumber: data.mobileNumber!,
      createdAt: now,
      updatedAt: now
    }

    agents.push(agent)
    return agent
  },
  remove(id: string) {
    const index = agents.findIndex(a => a.id === id)
    if (index === -1) return false
    agents.splice(index, 1)
    return true
  }
}
