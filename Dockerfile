# Usa Node 18 como base
FROM node:18

# Define pasta de trabalho
WORKDIR /app

# Copia todos os arquivos do projeto para dentro do contêiner
COPY . .

# Instala dependências do projeto
RUN npm install

# Instala Angular CLI e json-server de forma global
RUN npm install -g @angular/cli json-server

# Expõe portas (Angular e json-server)
EXPOSE 4200
EXPOSE 3000

# Comando para rodar Angular + json-server simultaneamente
CMD ["sh", "-c", "json-server --watch src/dados/db.json --port 3000 & ng serve --host 0.0.0.0 --port 4200 --disable-host-check --proxy-config proxy.conf.json"]
