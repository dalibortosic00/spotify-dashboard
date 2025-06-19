FROM node:24

WORKDIR /app

COPY frontend/package.json frontend/yarn.lock frontend/.yarnrc.yml /app/
COPY frontend/.yarn/ /app/.yarn/
COPY .env .env

RUN corepack enable && yarn install

COPY frontend/ /app/

RUN yarn build

EXPOSE 5173

CMD ["yarn", "preview", "--host"]
