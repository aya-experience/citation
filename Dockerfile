FROM ayaxp/citation-base

# install all dependencies
ADD package.json ./
RUN yarn install

# add node content initially
ADD . .
RUN yarn bootstrap
RUN yarn build

EXPOSE 4000

CMD cd ./citation-react-demo && yarn start
