FROM node:latest
WORKDIR /src
ADD . /src
RUN groupadd -g 999 appuser
RUN useradd -r -u 999 -g appuser appuser
RUN chown -R appuser:appuser /src
RUN yarn install
CMD npm start