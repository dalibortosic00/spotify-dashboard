# Dev
FROM node:24 AS dev

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml /app/
COPY frontend/.yarn/ /app/.yarn/
COPY .env .env

RUN corepack enable && yarn install

COPY frontend/ /app/

CMD ["yarn", "dev", "--host"]

# Build
FROM node:24 AS build

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml /app/
COPY frontend/.yarn/ /app/.yarn/

RUN corepack enable && yarn install

COPY frontend/ /app/

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN yarn build

# Prod
FROM node:24 AS prod

WORKDIR /app

RUN corepack enable

COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/.yarn /app/.yarn
COPY --from=build /app/.yarnrc.yml /app/.yarnrc.yml
COPY --from=build /app/.pnp.* /app/
COPY --from=build /app/yarn.lock /app/yarn.lock

EXPOSE 5173

CMD ["yarn", "preview", "--host", "--port", "5173"]
