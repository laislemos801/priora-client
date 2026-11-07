# Front do Priora em contêiner: build com Node e servido por nginx.
#
#   docker build -t priora-web --build-arg VITE_API_URL=http://SERVIDOR:8000 .
#
# VITE_API_URL é embutido no build: precisa ser o endereço da API visto pelo
# NAVEGADOR de quem usa o sistema (não o nome interno do Docker).

FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
