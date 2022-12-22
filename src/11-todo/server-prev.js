import fs            from "node:fs";
import path          from 'node:path';
import url           from 'node:url';
import Fastify       from 'fastify';
import fastifyStatic from '@fastify/static';
import tasks         from './tasks-prev.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const fastify = Fastify({
  logger: true,
  http2 : true,
  https : {
    key : fs.readFileSync(path.join(__dirname, '..', 'localhost.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'localhost.cert'))
  }
});

fastify.register(fastifyStatic, {
  root: path.join(__dirname, './public')
});

fastify.get('/tasks', async (req, res) => {
  return tasks.read();
});

fastify.get('/tasks/:id', async (req, res) => {
  return tasks.read(req.params.id);
});

fastify.post('/tasks', async (req, res) => {
  return tasks.create(req.body);
});

fastify.put('/tasks/:id', async (req, res) => {
  return tasks.update(req.params.id, req.body);
});

fastify.delete('/tasks/:id', async (req, res) => {
  return tasks.delete(req.params.id);
});

fastify.listen({port: 3000}, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
});