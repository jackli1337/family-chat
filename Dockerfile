FROM ubuntu:18.04

RUN apt-get update

ENV HOME /root

WORKDIR /root

RUN apt-get update --fix-missing
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh
RUN bash nodesource_setup.sh
RUN apt-get install -y nodejs

COPY . .

RUN npm install

EXPOSE 8000

CMD ["node", "app.js"]