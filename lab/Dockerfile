# Stage 1: Build the Angular application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN pnpm run build --prod

# Stage 2: Serve the application with nginx
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /app/dist/your-angular-app /usr/share/nginx/html

# Copy the nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]


# 3. **Build and Run the Docker Image**:
#
#    - Build the Docker image:
#
#      ```bash
#      docker build -t your-angular-app .
#      ```
#
#    - Run the Docker container:
#
#      ```bash
#      docker run -p 80:80 your-angular-app
#      ```
