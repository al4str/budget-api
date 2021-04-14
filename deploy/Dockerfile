# Build
FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN apk add --no-cache python make g++
RUN cp ./deploy/.env.example ./.env
RUN npm ci --only=production
RUN npm run build
RUN mkdir ./volume
# Run
VOLUME ./volume
EXPOSE 8080
CMD ["node", "--max-old-space-size=300", "dist/index.js"]
