# Agent Instructions for Ashiba

## Build & Test Commands

- **Dev**: `bun run dev` or `bun run src/cli/index.ts new <template>`
- **Build**: `bun build --compile src/cli/index.ts --outfile dist/ashiba`
- **Test**: `bun test` (run all tests)
- **Test single file**: `bun test src/core/scaffold.test.ts`

## Architecture

**Ashiba** is a fast file scaffolding CLI built with **Bun**. It reads TOML template configs from `.ashiba/` directory and generates files with interpolated variables.

### Directory Structure
```
src/
├── cli/        # CLI entry point & zlye command definitions
├── core/       # Config loading, file generation, interactive prompts
└── utils/      # Filesystem utilities
```

### Key Modules
- **config.ts**: Parses `.ashiba/*.toml` templates using `@ltd/j-toml` and validates with `arktype`
- **scaffold.ts**: Core file generation logic with variable interpolation
- **prompt.ts**: Interactive CLI using `prompts` library with text/select inputs
- **fs.ts**: File system utilities

## Code Style & Conventions

- **Language**: TypeScript (ESNext target, strict mode enabled)
- **Runtime**: Bun (prefer `bun:*` APIs; avoid Node.js equivalents)
- **Module format**: ES modules with `allowImportingTsExtensions: true`
- **CLI**: Built with [zlye](https://github.com/arshad-yaseen/zlye) command parser
- **No build step**: Use `bun:test`, `bun run`, `bun build --compile`
- **Imports**: Named imports preferred; use relative paths for internal modules
- **Error handling**: Throw descriptive errors; let prompts library handle user input
- **File I/O**: Use `Bun.file()` over `node:fs` where possible
