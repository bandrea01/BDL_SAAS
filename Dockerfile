# Usa l'immagine ufficiale di Node.js come base
FROM node:latest
 
# Imposta la directory di lavoro all'interno del contenitore
WORKDIR /app
 
# Copia il file package.json e package-lock.json nella directory di lavoro
COPY package*.json ./
 
# Installa le dipendenze dell'applicazione
RUN npm install
 
# Copia il resto del codice dell'applicazione nella directory di lavoro
COPY . .
 
# Espone la porta 3000 su cui l'applicazione sarà in ascolto
EXPOSE 3000
 
# Avvia l'applicazione
CMD ["npm", "run", "dev"]