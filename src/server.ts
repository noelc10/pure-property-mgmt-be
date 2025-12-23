import http from 'http'
import { AgentStore } from './stores/agent.store'
import { parseBody } from './utils/parseBody'

const server = http.createServer(async (req, res) => {
  const { method, url } = req
  res.setHeader('Content-Type', 'application/json')

  try {
    if (method === 'GET' && url === '/agents') {
      res.writeHead(200)
      return res.end(JSON.stringify(AgentStore.all()))
    }

    if (method === 'POST' && url === '/agents') {
      const body = await parseBody(req)
      const agent = AgentStore.create(body)
      res.writeHead(201)
      return res.end(JSON.stringify(agent))
    }

    if (method === 'GET' && url?.startsWith('/agents/')) {
      const id = url.split('/')[2]
      const agent = AgentStore.get(id)
      if (!agent) { res.writeHead(404); return res.end(JSON.stringify({ message: 'Not found' })) }
      res.writeHead(200)
      return res.end(JSON.stringify(agent))
    }

    if (method === 'PUT' && url?.startsWith('/agents/')) {
      const id = url.split('/')[2]
      const body = await parseBody(req)
      const agent = AgentStore.update(id, body)
      if (!agent) { res.writeHead(404); return res.end(JSON.stringify({ message: 'Not found' })) }
      res.writeHead(200)
      return res.end(JSON.stringify(agent))
    }

    if (method === 'DELETE' && url?.startsWith('/agents/')) {
      const id = url.split('/')[2]
      const success = AgentStore.remove(id)
      if (!success) { res.writeHead(404); return res.end(JSON.stringify({ message: 'Not found' })) }
      res.writeHead(204)
      return res.end()
    }

    res.writeHead(404)
    res.end(JSON.stringify({ message: 'Route not found' }))
  } catch {
    res.writeHead(400)
    res.end(JSON.stringify({ message: 'Bad request' }))
  }
})

server.listen(3000, () => console.log('API running at http://localhost:3000'))
