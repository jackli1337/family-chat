FROM ubuntu:18.04

RUN apt-get update

ENV HOME /root

WORKDIR /root

RUN apt-get update --fix-missing
RUN apt-get install -y nodejs
RUN apt-get install -y npm

COPY . .

RUN mv ./node_modules ./node_modules.tmp \
  && mv ./node_modules.tmp ./node_modules \
  && npm install

EXPOSE 8000

CMD ["node", "app.js"]