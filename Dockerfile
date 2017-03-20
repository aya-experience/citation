FROM ayaxp/citation-base

# install all dependencies
ADD package.json ./
RUN npm install

# add node content initially
ADD . .
RUN npm run bootstrap
RUN npm run build

EXPOSE 4000

CMD cd ./citation-demo && npm start
