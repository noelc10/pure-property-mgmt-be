import http from 'http'
import { AgentStore } from './stores/agent'
import { parseBody } from './utils/parseBody'

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  const { method, url } = req
  res.setHeader('Content-Type', 'application/json')

  try {
    // GET all agents
    if (method === 'GET' && url === '/agents') {
      res.writeHead(200)
      return res.end(JSON.stringify(AgentStore.all()))
    }

    // GET single agent
    if (method === 'GET' && url?.startsWith('/agents/')) {
      const id = url.split('/')[2]
      const agent = AgentStore.get(id)
      if (!agent) { res.writeHead(404); return res.end(JSON.stringify({ message: 'Not found' })) }
      res.writeHead(200)
      return res.end(JSON.stringify(agent))
    }

    // CREATE or UPDATE agent
    if (method === 'POST' && url === '/agents') {
      const body = await parseBody(req)
      const agent = AgentStore.createOrUpdate(body)
      res.writeHead(200)
      return res.end(JSON.stringify(agent))
    }

    // DELETE agent
    if (method === 'DELETE' && url?.startsWith('/agents/')) {
      const id = url.split('/')[2]
      const success = AgentStore.remove(id)
      if (!success) { res.writeHead(404); return res.end(JSON.stringify({ message: 'Not found' })) }
      res.writeHead(204)
      return res.end()
    }

    res.writeHead(404)
    res.end(JSON.stringify({ message: 'Route not found' }))
  } catch (err) {
    res.writeHead(400)
    res.end(JSON.stringify({ message: 'Bad request' }))
  }
})

server.listen(3000, () => console.log('API running at http://localhost:3000'))
