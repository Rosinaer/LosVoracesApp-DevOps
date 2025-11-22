# Los Voraces App — TP Integrador DevOps

Este proyecto consiste en una aplicación web simple basada en Node.js + Express + MongoDB, dockerizada y desplegada mediante un pipeline CI/CD usando GitHub Actions, Docker Hub, Render y Vercel.

## Tecnologías utilizadas

Backend: Node.js + Express

Base de datos: MongoDB Atlas

Frontend: HTML/CSS/JS (desplegado en Vercel)

Contenedores: Docker

CI/CD: GitHub Actions

Despliegue Backend: Render

Despliegue Frontend: Vercel

## Enlaces principales

- Frontend (Vercel)
  https://los-voraces-app-dev-5mqx7fols-rosinaers-projects.vercel.app/

- Backend (Render)
  https://los-voraces-app-dev-ops-uny1-ku7hxzff8-rosinaers-projects.vercel.app/

- Docker Hub (imagen publicada)
  https://hub.docker.com/repository/docker/rosinaer/los-voraces/general

## Pipeline CI/CD

El pipeline automatiza:

Construcción del proyecto

Ejecución de tests con Jest

Build de imagen Docker

Push automático a Docker Hub

El workflow se ejecuta en cada push a la rama main.

## Cómo correr el proyecto localmente (sin Docker)

cd Version-1.1/backend
npm install
npm start

## Capturas y TXT

Se incluiye una carpeta Pruebas con TXT de los test realizados y las siguientes capturas:

Ejecución del pipeline CI/CD (GitHub Actions)

Imagen publicada en Docker Hub

Pruebas automatizadas corriendo

Funcionalidad del sistema (registro/login/catálogos)
