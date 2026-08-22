'use strict';

const Fastify = require('fastify');
const cors = require('@fastify/cors');
const { scrapeLazada } = require('./scraper/lazada');

const fastify = Fastify({ logger: true });

fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET'],
});

// Cache to avoid hammering the platforms with the same queries
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

// GET /search?q=<query>
fastify.get('/search', async (request, reply) => {
  const query = request.query.q?.trim();

  if (!query || query.length < 2) {
    return reply.status(400).send({ error: 'Query must be at least 2 characters.' });
  }

  const cacheKey = query.toLowerCase();
  const cached = getCached(cacheKey);
  if (cached) {
    fastify.log.info(`[Cache HIT] "${query}"`);
    return reply.send({ query, results: cached, cached: true });
  }

  fastify.log.info(`[Scraping] "${query}"`);

  // Run scraper
  const lazadaResults = await scrapeLazada(query);

  const results = { lazada: lazadaResults };
  setCache(cacheKey, results);

  return reply.send({ query, results, cached: false });
});

// Health check
fastify.get('/health', async () => ({ status: 'ok' }));

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
    console.log('🚀 PriceCheck PH backend running on http://localhost:3001');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
