/**
 * Piezas JSON IS-Swagger vs `iss-swagger-doc.ts`.
 * Si existe el repo PatyIA en el disco (dev), valida los ficheros reales.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const { assertIssSwaggerPiezas } = await import('../dist/cdn/js/iss-swagger-doc.js');

const ISS = process.env.ISS_SWAGGER_DIR
  || join(ROOT, '..', '..', '..', 'PatyIA', 'api', 'src', 'utils', 'system', 'is-swagger');

test('assertIssSwaggerPiezas rechaza kind mezclado', () => {
  const errs = assertIssSwaggerPiezas({
    meta: { kind: 'config', version: 2, info: { title: 'x' } },
    paths: { kind: 'config', version: 2, paths: {} },
  });
  assert.ok(errs.some((m) => m.includes('meta.kind')));
  assert.ok(errs.some((m) => m.includes('paths.kind')));
});

test('piezas PatyIA is-swagger cumplen el contrato', (t) => {
  if (!existsSync(join(ISS, 'swagger__meta.json'))) {
    t.skip('PatyIA/api no está al lado de isc-swagger');
    return;
  }
  const meta = JSON.parse(readFileSync(join(ISS, 'swagger__meta.json'), 'utf8'));
  const paths = JSON.parse(readFileSync(join(ISS, 'swagger__paths.json'), 'utf8'));
  const config = JSON.parse(readFileSync(join(ISS, 'swagger__config.json'), 'utf8'));
  const errs = assertIssSwaggerPiezas({ meta, paths, config });
  assert.deepEqual(errs, [], errs.join('\n'));
});
