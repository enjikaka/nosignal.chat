build:
	npx esbuild workbox-modules.js --outfile=public/sw-scripts/modules.js --bundle --format=esm
	npx esbuild src/worker-modules.js --outfile=public/workers/modules.js --bundle --format=esm
	npx workbox injectManifest workbox-config.cjs

dev: build
	deno run --allow-net --allow-read --watch https://deno.land/std@0.170.0/http/file_server.ts --port 1567 public
