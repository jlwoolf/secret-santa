FROM node:20 AS build

WORKDIR /usr/app
COPY package.json .
RUN npm install
COPY . .

RUN npm run check
RUN npm run build
RUN npm run db:push

FROM node:20 AS run

WORKDIR /usr/app
COPY --from=build /usr/app/package.json ./package.json
COPY --from=build /usr/app/build ./build
RUN npm install --omit=dev
ENTRYPOINT [ "node", "build" ]
