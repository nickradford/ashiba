# 🏗️ Ashiba

**Ashiba** (足場) means “scaffolding” in Japanese — a blazing-fast file scaffolding CLI built with **Bun**.  
Define reusable project templates using TOML, and generate files in miliseconds from the command line.

---

## Todo

- [x] actually scaffold the template out with variable interpolation
- [x] `ashiba list` list all templates in the current project
- [ ] `ashiba init` create the base ashiba file structure
- [ ] `ashiba doctor` find issues with the templates (missing keys in config)
- [ ] String transformations (e.g., `{name | slugify}`)
- [ ] Interactive mode — list templates and create new instance
- [ ] Website
- [ ] Template registry? Inspired by shadcn registry
- [ ] Explore using handlebars for flow control in templates
- [ ] Changelog & semver

---

## ✨ Features

- ⚡ **Instant startup** — built on Bun, optimized for speed
- 🧩 **Template-based generation** — define scaffolds in `.ashiba/`
- 🗄️ **TOML-powered config** — readable, minimal, and flexible
- 🧠 **Interactive prompts** — guided input with select/dropdown support
- 🪶 **Lightweight architecture** — clean separation of CLI, config, and file logic
- 🔌 **Extensible commands** — powered by [commander](https://github.com/tj/commander.js) for structured CLI parsing

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

## 📋 Input Types

Ashiba supports four input types in your TOML config:

**Text** — Standard text input

```toml
[name]
description = "The name of the file"
```

**Number** — Numeric input with optional min/max validation

```toml
[reading_goal]
description = "How many books do you want to read?"
type = "number"
default = 5
min = 1
max = 100
```

**Select** — Choose from predefined options

```toml
[author]
description = "Who is writing the thing?"
select = ["Larry", "Curly", "Moe"]
```

**Confirm** — Boolean yes/no prompt

```toml
[publish]
confirm = "Should this be published now?"
```

---

## 🔧 Project Architecture

```
ashiba/
├─ src/
│  ├─ cli/
│  │  ├─ index.ts        # CLI entry point & program setup
│  │  └─ commands/
│  │     ├─ index.ts     # Command exports
│  │     ├─ new.ts       # Scaffold new template command
│  │     └─ list.ts      # List templates command
│  ├─ core/
│  │  ├─ config.ts       # Loads and validates TOML configs
│  │  ├─ scaffold.ts     # Core file generation & interpolation
│  │  ├─ prompt.ts       # Interactive CLI prompts
│  │  └─ templates.ts    # Template discovery & metadata
│  └─ utils/
│     └─ fs.ts           # File system utilities
├─ .ashiba/              # User template definitions
├─ dist/                 # Compiled binary output
├─ package.json
├─ tsconfig.json
├─ bunfig.toml
└─ README.md
```

### Core commands

| Command                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| `ashiba new <template>` | Create a new file scaffold using a named template |
| `ashiba list`           | List all available templates                      |
| `ashiba help`           | Show command help and options                     |

Ashiba uses [commander](https://github.com/tj/commander.js) for command handling, [smol-toml](https://github.com/squirrelchat/smol-toml) for parsing TOML, [arktype](https://github.com/arktypeio/arktype) for validation, and [@inquirer/prompts](https://github.com/SBoudrias/Inquirer.js) for interactive input.

---

## 💡 Example Use Cases

- Generate blog posts and changelogs
- Bootstrap feature modules or components
- Create new microservices or handler scaffolds

---

## 🧰 Development

Run locally:

```bash
bun run dev new blog-post
```

Build for distribution:

```bash
bun run build
```

New commands are built in `src/cli/commands/` using [commander](https://github.com/tj/commander.js)

---

## ⚖️ License

MIT — feel free to hack, modify, and scaffold your heart out.
