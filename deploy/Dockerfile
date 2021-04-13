# Build
FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN apk add --no-cache python make g++ \
  && cp ./deploy/.env.example ./.env \
  && npm ci --only=production \
  && npm run build \
  && mkdir ./db
# Run
VOLUME ./db
EXPOSE 8080
CMD ["node", "--max-old-space-size=300", "dist/index.js"]
