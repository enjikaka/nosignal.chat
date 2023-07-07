FROM denoland/deno:alpine-1.35.0

WORKDIR /app
USER deno

COPY . .

CMD ["run", "--allow-net", "--allow-read", "https://deno.land/std@0.193.0/http/file_server.ts", "public"]

EXPOSE 4507
