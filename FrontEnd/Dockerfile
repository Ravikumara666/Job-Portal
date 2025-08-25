# Stage 1: Build React App
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG VITE_USER_END_POINT
ARG VITE_ORIGINAL_BASE_URL
ARG VITE_GOOGLE_API_KEY
ARG VITE_GOOGLE_API_URL

ENV VITE_USER_END_POINT=$VITE_USER_END_POINT
ENV VITE_ORIGINAL_BASE_URL=$VITE_ORIGINAL_BASE_URL
ENV VITE_GOOGLE_API_KEY=$VITE_GOOGLE_API_KEY
ENV VITE_GOOGLE_API_URL=$VITE_GOOGLE_API_URL

RUN npm run build

# Stage 2: Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]