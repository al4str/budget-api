# Build
FROM node:alpine as builder
WORKDIR /usr/src/app
COPY deploy/.env.example ./.env
COPY src ./src
COPY package*.json ./
COPY webpack.config.js ./
RUN apk add --no-cache python make g++
RUN npm ci --only=production && npm run build
# Prepare
FROM node:alpine as app
WORKDIR /usr/src/app
COPY --from=builder node_modules .
COPY --from=builder dist .
# Add tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
# Run
RUN mkdir ./db
VOLUME ./db
EXPOSE 8080
CMD ["node", "--max-old-space-size=300", "dist/index.js"]
