import { test, expect } from "bun:test";

test("ashiba package exports main functionality", async () => {
  const pkg = await import("./package.json");
  expect(pkg.name).toBe("@ashiba-dev/ashiba");
  expect(pkg.description).toContain("scaffolding");
  expect(pkg.type).toBe("module");
});

test("build output file is configured", async () => {
  const pkg = await import("./package.json");
  expect(pkg.bin.ashiba).toBe("./dist/ashiba");
});
