FROM tarampampam/node:13.1-alpine

LABEL maintainer="Hannes Rüger"
LABEL name="AGFree"

RUN mkdir -p /app/config && mkdir /app/dist && mkdir /app/data
COPY backend /app/dist
COPY frontend /app/dist/frontend
COPY container-env.json /container-env.json

EXPOSE 80
CMD    ["node", "/app/dist/index.js"]
