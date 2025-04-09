# AppAgenda

## DOCKER

Passos para rodar no Play with Docker

gerar o build producao
ng build --configuration production
Zipe seu projeto (incluindo esse Dockerfile) e envie ao Play with Docker.

Extraia o .zip:

criar o diretorio, mkdir app-agenda
cd app-agenda
unzip app-agenda.zip

Build da imagem:
docker-compose up --build

ou
docker build -t app-agenda .

Rode o contêiner:
docker run -d -p 4200:4200 -p 3000:3000 app-agenda

No PWD, clique para expor a porta 4200 (onde estará o Angular) e a porta 3000 (onde estará o json-server).
Assim, você acessa:

App Angular: http://SEU_IP:4200
json-server: http://SEU_IP:3000

## LEMBRAR DE ATUALIZAR O IP do CONTAINER NOS SERVICES de COMPROMISSO, CONTATO e LOCAL.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.7.

# Detalhe dos diretórios / arquivos do projeto

components/ - Contém todos os componentes da aplicação:
compromissos/
contatos/
locais/
login/
nav/

services/ - Contém todos os serviços:
auth.service.ts
compromisso.service.ts
contato.service.ts
local.service.ts

models/ - Contém todas as interfaces:
compromisso.interface.ts
contato.interface.ts
local.interface.ts
usuario.interface.ts

guards/ - Contém os guards de proteção de rotas:
admin.guard.ts
auth.guard.ts

Arquivos principais:
app.component.ts
app.config.ts
app.routes.ts

## PRIMEIRO PASSO INSTALAR AS DEPENDÊNCIAS

npm install ou npx npm install

## Para iniciar o JSON-SERVER (contem os compromissos, contatos e locais)

npx json-server --watch src/dados/db.json

## Development server

To start a local development server, run:

```bash
ng serve    ou  npx ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Usuarios criados para testar

admin = rulir@teste.com / 2569
user = rulir@hotmail.com / 2569

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
