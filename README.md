# 🏗️ Ashiba

**Ashiba** (足場) means “scaffolding” in Japanese — a blazing-fast file scaffolding CLI built with **Bun**.  
Define reusable project templates using TOML, and generate files in seconds from the command line.

---

## Todo

- [ ] actually scaffold the template out with variable interpolation
- [ ] `ashiba list` list all templates in the current project
- [ ] `ashiba doctor` find issues with the templates
- [ ] `ashiba ashiba <template>` interactive template generator

---

## ✨ Features

- ⚡ **Instant startup** — built on Bun, optimized for speed
- 🧩 **Template-based generation** — define scaffolds in `.ashiba/`
- 🗄️ **TOML-powered config** — readable, minimal, and flexible
- 🧠 **Interactive prompts** — guided input with select/dropdown support
- 🪶 **Lightweight architecture** — clean separation of CLI, config, and file logic
- 🔌 **Extensible commands** — powered by [zlye](https://github.com/nbarbettini/zlye) for structured CLI parsing

---

## 📦 Installation

Once published, install globally with Bun:

```bash
bun install -g ashiba
```

For local development:

```bash
bun link
```

Then you can run `ashiba` anywhere on your system.

---

## 🧱 Quick Start

Create a `.ashiba` directory in your project root:

```
.ashiba/
├─ blog-post.toml
├─ blog-post/
│  └─ {title}.md
```

Define your scaffold config in `blog-post.toml`:

```toml
order = ["title", "author"]

[title]
description = "The title of the post"

[author]
description = "Who wrote the blog post"
select = ["Nick", "Alice", "Jean"]
```

Then generate your scaffold:

```bash
ashiba new blog-post
```

You’ll be prompted for each field:

```
? The title of the post: Hello World
? Who wrote the blog post: Alice
```

Ashiba will interpolate variables into filenames and contents:

```
./
└── Hello World.md
```

---

## 🔧 Project Architecture

```
ashiba/
├─ src/
│  ├─ cli/
│  │  └─ index.ts         # CLI entry and command definitions
│  ├─ core/
│  │  ├─ config.ts        # Loads and validates TOML configs
│  │  ├─ scaffold.ts      # Core file generation logic
│  │  └─ prompt.ts        # Interactive CLI prompts
│  └─ utils/
│     └─ fs.ts
├─ .ashiba/               # User template definitions
├─ bunfig.toml
├─ package.json
└─ README.md
```

### Core commands

| Command                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `ashiba new <template>` | Create a new file scaffold using a named template |
| `ashiba help`           | Show command help and options                     |

Ashiba uses **zlye** for command handling, **@ltd/j-toml** for parsing TOML, and **prompts** for interactive input.

---

## 💡 Example Use Cases

- Generate blog posts and changelogs
- Bootstrap feature modules or components
- Create new microservices or handler scaffolds

---

## 🧰 Development

Run locally:

```bash
bun run src/cli/index.ts new blog-post
```

Build for distribution:

```bash
bun build --compile src/cli/index.ts --outfile dist/cli.js
```

New commands are built in `src/cli/index.ts` using [zlye](https://github.com/arshad-yaseen/zlye)

---

## ⚖️ License

MIT — feel free to hack, modify, and scaffold your heart out.
