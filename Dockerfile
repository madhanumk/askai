# Step 1: Use an official Node.js image as the base image
FROM node:22.4.0-alpine


# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json (if present) into the container
COPY package.json package-lock.json* ./

# Step 4: Install dependencies
RUN npm install --f

# Step 5: Copy the rest of the application code into the container
COPY . .

# Add environment variables from the .env.local file
COPY .env.local .env.local

COPY .eslintrc.js .eslintrc.js


# Step 6: Build the Next.js app
RUN npm run build

# Step 7: Expose port (default Next.js port)
EXPOSE 3000

# Step 8: Start the Next.js app
CMD ["npm", "start"]
