FROM node:16 as build-stage

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

# inject the api url into the app's runtime
ARG API_BASE_URL
ENV API_BASE_URL=$API_BASE_URL

# RUN yarn build

# # Put the API behind nginx
# FROM nginx
# COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
# EXPOSE $REACT_DOCKER_PORT
# CMD nginx -g 'daemon off;'

CMD yarn start
