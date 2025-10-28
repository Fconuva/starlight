# Sistema de Evaluación# Starlight Starter Kit: Basics



## 📍 Acceder a la Aplicación[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)



``````

https://profesorajavierapoblete-h6hukxjek-fconuvas-projects.vercel.app/privado/app.htmlnpm create astro@latest -- --template starlight

``````



## ✨ Funcionalidades<!-- ASTRO:REMOVE:START -->



- ✅ Crear y gestionar cursos[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/starlight/tree/main/examples/basics)

- ✅ Agregar estudiantes por curso[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/starlight/tree/main/examples/basics)

- ✅ Crear tareas y evaluaciones[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/withastro/starlight&create_from_path=examples/basics)

- ✅ Registrar calificaciones[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fwithastro%2Fstarlight%2Ftree%2Fmain%2Fexamples%2Fbasics&project-name=my-starlight-docs&repository-name=my-starlight-docs)

- ✅ Generar reportes

<!-- ASTRO:REMOVE:END -->

## 💾 Datos

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Los datos se guardan automáticamente en el navegador (IndexedDB).

## 🚀 Project Structure

## 📁 Estructura

Inside of your Astro + Starlight project, you'll see the following folders and files:

```

public/privado/```

├── app.html          ← Aplicación principal.

```├── public/

├── src/

## 🚀 Cómo Usar│   ├── assets/

│   ├── content/

1. Abre la URL en tu navegador│   │   └── docs/

2. Crea un curso│   └── content.config.ts

3. Agrega estudiantes├── astro.config.mjs

4. Crea tareas├── package.json

5. Ingresa calificaciones└── tsconfig.json

6. Genera reportes```



¡Los datos se guardan automáticamente!Starlight looks for `.md` or `.mdx` files in the `src/content/docs/` directory. Each file is exposed as a route based on its file name.


Images can be added to `src/assets/` and embedded in Markdown with a relative link.

Static assets, like favicons, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [Starlight’s docs](https://starlight.astro.build/), read [the Astro documentation](https://docs.astro.build), or jump into the [Astro Discord server](https://astro.build/chat).
