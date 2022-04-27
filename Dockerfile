FROM node:12-alpine AS BUILD_IMAGE

# Create working directory
WORKDIR /app-react

# get package.json and install dependencies first
COPY package.json  .
RUN npm install

# Install and configure `serve`.
RUN npm install -g serve
RUN apk update && apk add bash
# Copy source code to image
COPY . ./

# Expose service port
ENV PORT=7141
ENV NODE_OPTIONS=--max_old_space_size=4096
ENV GENERATE_SOURCEMAP=false
EXPOSE 7141 

# RUN /app/buildScript.sh
# CMD ["serve", "-s", "build", "-l", "7141"]
CMD ["npm", "start"]