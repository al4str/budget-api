# Build
FROM node:alpine
WORKDIR /usr/src/app
COPY . .
RUN apk add --no-cache python make g++ \
  && cp ./deploy/.env.example ./.env \
  && npm ci --only=production \
  && npm run build \
  && mkdir ./db
# Add tini
ENV TINI_VERSION v0.19.0
ADD https://github.com/krallin/tini/releases/download/${TINI_VERSION}/tini /tini
RUN chmod +x /tini
ENTRYPOINT ["/tini", "--"]
# Run
VOLUME ./db
EXPOSE 8080
CMD ["node", "--max-old-space-size=300", "dist/index.js"]
