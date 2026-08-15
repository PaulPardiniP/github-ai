import "dotenv/config";
import { Octokit } from "@octokit/rest";

// Lee el token desde el archivo .env
const token = process.env.GITHUB_TOKEN;

// Si no existe el token, detenemos la aplicación
if (!token) {
  throw new Error("Falta la variable de entorno GITHUB_TOKEN");
}

// Creamos el cliente REAL que se comunicará con GitHub
export const githubClient = new Octokit({
  auth: token,
});