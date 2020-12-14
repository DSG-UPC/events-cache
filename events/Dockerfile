FROM node:15.4.0-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
USER node
RUN npm ci && npm cache clean --force --loglevel=error
COPY --chown=node:node src ./src
CMD ["node", "src/index.js"]