FROM cypress/base:18.16.0
WORKDIR /app
COPY . .
RUN npm install
RUN npx cypress run
RUN npm cypress open
