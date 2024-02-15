# Usa un'immagine Node.js come base
FROM node:21.6.1

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia i file del progetto nella directory di lavoro del container
COPY package*.json ./
COPY .. .

# Installa le dipendenze del progetto
RUN npm install

# Espone la porta su cui il server sarà in ascolto
EXPOSE 5173

# Comando per avviare l'applicazione quando il container viene avviato
CMD ["npm", "run", "dev"]