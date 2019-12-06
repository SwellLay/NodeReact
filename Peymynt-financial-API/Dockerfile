FROM igloo/base-node-wkhtmltopdf:9.4.0

MAINTAINER John

RUN mkdir /usr/src/app

ADD . /usr/src/app

WORKDIR /usr/src/app

RUN npm install

EXPOSE 5060

# Start the app
#ENTRYPOINT ["/bin/bash", "/usr/src/app/start.sh"]
CMD [ "npm", "run", "dev" ]

