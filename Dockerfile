FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
ARG GIT_COMMIT_SHA
ENV GIT_COMMIT_SHA=$GIT_COMMIT_SHA
COPY . .
RUN npm run build

FROM nginx:alpine AS final
COPY --from=build /app/dist /usr/share/nginx/html
COPY --from=build /app/default.conf.template /etc/nginx/templates/default.conf.template
COPY 20-generate-env-config.sh /docker-entrypoint.d/20-generate-env-config.sh
RUN chmod +x /docker-entrypoint.d/20-generate-env-config.sh
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
