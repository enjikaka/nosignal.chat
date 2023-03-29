FROM denoland/deno:alpine-1.29.1

WORKDIR /app
USER deno

COPY . .

CMD ["run", "--allow-net", "--allow-read", "https://deno.land/std@0.170.0/http/file_server.ts", "public"]

EXPOSE 4507
