# Parent image
FROM node:18

# Set working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to working directory
COPY package*.json ./

# Install ffmpeg in container
RUN apt-get update && apt-get install -y ffmpeg

# Install packages in package.json
RUN npm install

# Copy app source inside docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Define command to run your app using CMD (only one CMD allowed)
CMD ["npm", "start"]