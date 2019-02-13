FROM node:8.11.1

RUN mkdir /app

WORKDIR /app

COPY index.html webpack.config.js package.json yarn.lock /app/
COPY src /app/src

RUN npm install yarn
RUN yarn install
RUN yarn build

# not how it should be, but this works at least:
CMD ["python", "-m", "SimpleHTTPServer", "8080"]

EXPOSE 8080


# build this file with
# docker build --tag graphs

# start the webserver with
# docker run --publish 8080:8080 graphs
