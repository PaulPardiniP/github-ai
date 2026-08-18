# GitHub AI Agent - MCP Server

Servidor MCP desarrollado con **Node.js + TypeScript** que permite a un agente de Inteligencia Artificial interactuar con GitHub mediante lenguaje natural.

El servidor se conecta a la API de GitHub utilizando **Octokit** y expone herramientas MCP que pueden ser utilizadas desde clientes compatibles como **Google Antigravity**.

El proyecto permite listar repositorios, crear repositorios, gestionar issues y realizar commits directamente sobre GitHub.

---

## Tecnologías utilizadas

- Node.js
- TypeScript
- Model Context Protocol SDK
- Octokit
- Zod
- Vitest
- GitHub REST API
- MCP Inspector
- Google Antigravity
- stdio

---

# Arquitectura

```text
Usuario
   ↓
Google Antigravity
   ↓
LLM
   ↓
MCP Server
   ↓
Tools
   ↓
Octokit
   ↓
GitHub API
```

En términos de MCP:

```text
Antigravity (Host)
        ↓
LLM / MCP Client
        ↓
MCP Server
        ↓
GitHub API
```

El usuario escribe una instrucción en lenguaje natural.

Ejemplo:

```text
Listame mis repositorios públicos de GitHub
```

El LLM interpreta la intención, selecciona la tool apropiada y envía los parámetros necesarios al MCP Server.

El servidor valida los datos con Zod y ejecuta la operación correspondiente contra GitHub.

---

# Tools disponibles

El servidor expone cinco herramientas principales.

## 1. `create_repository`

Crea un nuevo repositorio en la cuenta de GitHub autenticada.

### Parámetros

- `name`: nombre del repositorio.
- `description`: descripción opcional.

El nombre debe:

- tener entre 3 y 100 caracteres;
- no contener espacios;
- utilizar únicamente letras, números y guiones.

### Ejemplo de prompt

```text
Creame un repositorio llamado proyecto-mcp-demo con la descripción
Repositorio creado mediante mi agente MCP
```

---

## 2. `list_repositories`

Lista los repositorios accesibles por la cuenta autenticada.

### Parámetros

`type`:

```text
all
owner
public
private
member
```

`sort`:

```text
created
updated
pushed
full_name
```

Valores por defecto:

```text
type: all
sort: updated
```

### Ejemplo

```text
Listame mis repositorios públicos de GitHub
```

La respuesta se simplifica antes de ser enviada al LLM para evitar devolver información innecesaria de la API.

Ejemplo:

```json
[
  {
    "name": "github-ai",
    "private": false,
    "url": "https://github.com/usuario/github-ai",
    "description": null
  }
]
```

---

## 3. `create_issue`

Crea un issue dentro de un repositorio.

### Parámetros

- `owner`: propietario u organización.
- `repo`: nombre del repositorio.
- `title`: título del issue.
- `body`: descripción opcional.

### Ejemplo

```text
Creá un issue en repo-deprueba de PaulPardiniP
con título "Revisar documentación"
y descripción "Verificar el README antes de entregar"
```

---

## 4. `list_issues`

Lista los issues abiertos de un repositorio.

### Parámetros

- `owner`: propietario del repositorio.
- `repo`: nombre del repositorio.

### Ejemplo

```text
Mostrame los issues abiertos del repositorio repo-deprueba
de PaulPardiniP
```

La respuesta también se simplifica:

```json
[
  {
    "number": 1,
    "title": "Revisar documentación",
    "url": "https://github.com/usuario/repositorio/issues/1",
    "description": "Verificar el README antes de entregar"
  }
]
```

---

## 5. `create_commit`

Realiza un cambio directamente sobre un archivo de un repositorio de GitHub y registra ese cambio mediante un nuevo commit.

### Parámetros

- `owner`
- `repo`
- `branch`
- `filePath`
- `fileContent`
- `commitMessage`

La rama por defecto es:

```text
main
```

### Ejemplo

```text
En el repositorio github-ai de PaulPardiniP,
en la rama main,
creá un archivo nota.txt
con el contenido "Archivo creado desde Antigravity"
y hacé un commit con el mensaje "Prueba de create_commit"
```

El servidor devuelve el SHA del commit creado.

Ejemplo:

```text
Commit creado correctamente.
SHA: f2f0419567f9fbcc2648597738ccac1f3365230b
```

### Funcionamiento interno

`create_commit` utiliza la Git Data API de GitHub.

El flujo es:

```text
1. Obtener referencia de la rama
          ↓
2. Obtener commit y tree base
          ↓
3. Crear blob con el contenido
          ↓
4. Crear nuevo tree
          ↓
5. Crear commit
          ↓
6. Actualizar referencia de la rama
```

Esta tool trabaja directamente contra GitHub remoto.

No lee cambios locales de VS Code.

---

# Estructura del proyecto

```text
/src
  /tools
    create-repository.ts
    create-issue.ts
    list-repositories.ts
    create-commit.ts
    list-issues.ts

  /schemas
    index.ts

  /github
    client.ts
    operations.ts

  /errors
    index.ts

  /utils
    logging.ts
    retry.ts
    server.ts
    types.ts

/tests
  tools.test.ts
  github.test.ts
  errors.test.ts

.env.example
.gitignore
tsconfig.json
package.json
README.md
vitest.config.ts
```

---

# Instalación

Clonar el repositorio:

```bash
git clone https://github.com/PaulPardiniP/github-ai.git
```

Entrar al proyecto:

```bash
cd github-ai
```

Instalar dependencias:

```bash
npm install
```

---

# Configuración del GitHub Token

El servidor necesita un GitHub Personal Access Token.

En GitHub:

```text
Settings
→ Developer settings
→ Personal access tokens
→ Tokens classic
```

Crear un token con los permisos necesarios para las operaciones que se quieran realizar.

Para este proyecto se utilizaron:

```text
repo
user
admin:org
```

Crear en la raíz del proyecto:

```text
.env
```

Contenido:

```env
GITHUB_TOKEN=TU_TOKEN_DE_GITHUB
```

Nunca subir este archivo al repositorio.

El `.gitignore` incluye:

```text
.env
node_modules/
dist/
```

El proyecto incluye:

```text
.env.example
```

con:

```env
GITHUB_TOKEN=
```

---

# Scripts disponibles

## Desarrollo

```bash
npm run dev
```

## Compilar TypeScript

```bash
npm run build
```

Genera el código JavaScript dentro de:

```text
dist/
```

## Tests

```bash
npm run test
```

## Tests en modo watch

```bash
npm run test:watch
```

---

# MCP Inspector

Para probar el servidor MCP manualmente se utilizó MCP Inspector.

Primero:

```bash
npm run build
```

Después:

```bash
npx @modelcontextprotocol/inspector node dist/utils/server.js
```

Desde Inspector se pueden visualizar y ejecutar las cinco tools:

```text
create_repository
create_issue
list_repositories
create_commit
list_issues
```

MCP Inspector permite comprobar el servidor sin depender todavía de un LLM.

Se utilizaron pruebas reales contra GitHub para verificar operaciones de lectura y escritura.

---

# Integración con Google Antigravity

El servidor también fue integrado con Google Antigravity.

Abrir la configuración MCP de Antigravity:

```text
MCP Servers
→ Open MCP Config
```

Agregar:

```json
{
  "mcpServers": {
    "github-ai-agent": {
      "command": "node",
      "args": [
        "dist/utils/server.js"
      ],
      "cwd": "C:/RUTA/AL/PROYECTO/github-ai"
    }
  }
}
```

La ruta `cwd` debe modificarse según la ubicación local del proyecto.

El token de GitHub **no se almacena dentro de esta configuración**.

El servidor carga:

```text
GITHUB_TOKEN
```

desde el archivo `.env`.

Después de guardar la configuración, refrescar los servidores MCP en Antigravity.

---

# Uso mediante lenguaje natural

Una vez conectado a Antigravity, no es necesario seleccionar las tools manualmente.

Ejemplo:

```text
Listame mis repositorios privados de GitHub
```

El flujo es:

```text
Usuario
↓
LLM interpreta la solicitud
↓
selecciona list_repositories
↓
genera los parámetros
↓
MCP Server valida con Zod
↓
Octokit
↓
GitHub API
↓
respuesta
```

Otros ejemplos:

```text
Mostrame los issues abiertos del repositorio repo-deprueba
de PaulPardiniP
```

```text
Creá un issue en repo-deprueba llamado "Prueba Antigravity"
```

```text
Creame un repositorio llamado prueba-antigravity-mcp
```

```text
En github-ai agregá nota.txt con el contenido
"Prueba desde Antigravity"
y hacé un commit llamado "Prueba MCP"
```

---

# Validación con Zod

Cada tool posee un schema Zod.

Los schemas cumplen dos funciones:

```text
.describe()
→ explica al LLM qué información debe enviar

Zod validation
→ comprueba que los datos realmente sean válidos
```

Ejemplo:

Un nombre de repositorio inválido:

```text
mi repositorio
```

produce un error natural:

```text
El nombre del repositorio no puede contener espacios.
Usa solo letras, números y guiones.
```

Otros ejemplos:

```text
Debes indicar el propietario del repositorio.
```

```text
Debes indicar el título del issue.
```

```text
Debes indicar la ruta del archivo.
```

```text
Debes indicar un mensaje para el commit.
```

De esta forma se evita enviar datos inválidos a GitHub.

---

# Manejo de errores

El proyecto distingue diferentes categorías de error.

## Validation Error

Datos inválidos antes de llamar a GitHub.

Ejemplo:

```text
Debes indicar el propietario del repositorio.
```

---

## Authentication Error

Problemas con el GitHub Token.

Ejemplo:

```text
No fue posible autenticarse con GitHub.
Verifica el token configurado.
```

---

## GitHub API Error

Errores devueltos por GitHub.

Ejemplo para un repositorio inexistente:

```text
El repositorio "repositorio-ejemplo" no fue encontrado.
Verifica el nombre e intenta de nuevo.
```

---

## Network Error

Problemas de comunicación.

Ejemplo:

```text
No fue posible comunicarse con GitHub.
Verifica la conexión e intenta nuevamente.
```

---

## Rate Limit

Cuando GitHub limita temporalmente las solicitudes, el servidor utiliza un mecanismo de retry con espera exponencial.

Flujo:

```text
Solicitud
↓
429 Rate Limit
↓
espera
↓
reintento
↓
espera mayor si vuelve a fallar
```

El servidor evita enviar información sensible en los logs.

---

# Logging

Como el servidor utiliza transporte `stdio`, la salida estándar debe reservarse para la comunicación MCP.

Por ese motivo, los logs se envían mediante:

```text
stderr
```

con niveles:

```text
INFO
WARN
ERROR
```

Esto evita interferir con los mensajes JSON-RPC enviados entre el Host y el MCP Server.

---

# Testing

Los tests utilizan **Vitest**.

Actualmente el proyecto posee más del mínimo solicitado de 8 pruebas unitarias.

Se prueban:

### Schemas

- creación de repositorio válida;
- nombre demasiado corto;
- creación de issue válida;
- título vacío;
- valores por defecto de `list_repositories`;
- `list_issues`;
- owner inválido;
- `create_commit`;
- commit sin mensaje.

### GitHub operations

Las llamadas a GitHub no utilizan la API real durante los tests.

Se utiliza Dependency Injection junto a `vi.fn()`.

Ejemplo conceptual:

```ts
const fakeGithub = {
  request: vi.fn().mockResolvedValue(...)
};

const operations = makeGitHubOperations(fakeGithub);
```

Esto permite verificar qué solicitud habría realizado el código sin llamar realmente a GitHub.

### Errores

Se verifican entre otros:

```text
invalid_input
401 authentication_error
404 github_api_error
429 rate_limit_error
```

Ejecutar:

```bash
npm run test
```

---

# Dependency Injection

La capa GitHub recibe su cliente como dependencia:

```text
makeGitHubOperations(githubClient)
```

En producción:

```text
githubClient real
↓
GitHub API
```

En testing:

```text
fakeGithub
↓
vi.fn()
```

Esto crea un **seam**, es decir, un punto donde una dependencia externa puede ser reemplazada durante los tests.

---

# Comunicación MCP

El servidor utiliza JSON-RPC 2.0 mediante MCP.

Las operaciones principales son:

```text
tools/list
```

Permite al Host descubrir qué tools expone el servidor.

```text
tools/call
```

Permite ejecutar una de esas tools.

El flujo general es:

```text
Host
↓
tools/list
↓
MCP Server devuelve herramientas
↓
LLM selecciona una
↓
tools/call
↓
handler
↓
Zod
↓
GitHub operations
↓
GitHub API
```

---

# Seguridad

El proyecto sigue estas reglas:

- nunca guardar el GitHub Token en el código;
- utilizar variables de entorno;
- `.env` incluido en `.gitignore`;
- no mostrar secretos en logs;
- no incluir tokens en `mcp_config.json`;
- utilizar `.env.example` sin valores sensibles.

---

# Troubleshooting

## Falta `GITHUB_TOKEN`

Si aparece:

```text
Falta la variable de entorno GITHUB_TOKEN
```

verificar que exista:

```text
.env
```

y contenga:

```env
GITHUB_TOKEN=...
```

---

## Cambié código pero Inspector sigue mostrando la versión anterior

Eliminar el compilado anterior y volver a construir:

```bash
rm -rf dist
npm run build
```

Después reiniciar MCP Inspector.

---

## Git push rechazado después de usar create_commit

Las tools MCP modifican directamente GitHub remoto.

Por eso puede existir un commit remoto que todavía no está en la carpeta local.

Sincronizar con:

```bash
git pull --rebase origin main
```

Después:

```bash
git push
```

No es necesario utilizar `--force`.

---

## create_commit falla en un repositorio completamente vacío

La implementación necesita una referencia de rama y un commit base.

Un repositorio completamente vacío todavía no posee ese historial.

Se debe utilizar un repositorio que ya tenga al menos un commit inicial.

---

## Antigravity no detecta los cambios

Primero:

```bash
npm run build
```

Después refrescar el servidor MCP desde Antigravity.

---

# Resultado

El proyecto demuestra la integración completa entre:

```text
Lenguaje natural
        ↓
LLM
        ↓
Model Context Protocol
        ↓
Servidor TypeScript
        ↓
Zod
        ↓
Octokit
        ↓
GitHub API
```

Permitiendo que un agente de IA consulte y modifique GitHub utilizando herramientas controladas, validadas y testeadas.

# ¿Por qué es útil?

Este proyecto permite ejecutar operaciones habituales de GitHub mediante lenguaje natural utilizando un agente de IA conectado mediante MCP.

Casos de uso:

- Consultar repositorios públicos y privados.
- Crear nuevos repositorios.
- Crear y consultar issues.
- Crear archivos o modificar contenido y registrarlo mediante commits.
- Automatizar tareas habituales de GitHub desde un agente de IA.
- Integrar GitHub con aplicaciones compatibles con Model Context Protocol.

# Requisitos del sistema

- Node.js 18 o superior
- npm
- Git
- Cuenta de GitHub
- GitHub Personal Access Token
- Google Antigravity para utilizar el MCP mediante lenguaje natural

> Se recomienda utilizar Node.js 18 o superior para asegurar compatibilidad con las dependencias y el SDK de Model Context Protocol utilizados en el proyecto.

## create_repository

- `name`: `string` - nombre del repositorio.
- `description`: `string` opcional - descripción del repositorio.

## create_issue

- `owner`: `string` - usuario u organización propietaria.
- `repo`: `string` - nombre del repositorio.
- `title`: `string` - título del issue.
- `body`: `string` opcional - descripción del issue.

## list_repositories

- `type`: `enum` - `all`, `owner`, `public`, `private` o `member`.
- `sort`: `enum` - `created`, `updated`, `pushed` o `full_name`.

## list_issues

- `owner`: `string` - usuario u organización propietaria.
- `repo`: `string` - nombre del repositorio.

## create_commit

- `owner`: `string` - usuario u organización propietaria.
- `repo`: `string` - nombre del repositorio.
- `branch`: `string` - rama del repositorio. Por defecto `main`.
- `filePath`: `string` - ruta del archivo.
- `fileContent`: `string` - contenido del archivo.
- `commitMessage`: `string` - mensaje del commit.

# Licencia

Este proyecto se distribuye bajo la licencia MIT.