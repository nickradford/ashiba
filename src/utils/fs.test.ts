import { test, expect, beforeAll, afterAll } from "bun:test";
import { rmSync, mkdirSync } from "node:fs";

beforeAll(() => {
  // Create test directory structure
  mkdirSync("./test-fs", { recursive: true });
});

afterAll(() => {
  try {
    rmSync("./test-fs", { recursive: true });
  } catch {
    // Clean up
  }
});

test("file system operations preserve directory structure", async () => {
  const testFile = Bun.file("./test-fs/test.txt");
  await testFile.writer().write("test content");

  const content = await testFile.text();
  expect(content).toBe("test content");
  expect(await testFile.exists()).toBe(true);
});

test("Bun.file can create nested files", async () => {
  mkdirSync("./test-fs/nested/deep", { recursive: true });
  const nestedFile = Bun.file("./test-fs/nested/deep/file.txt");
  await nestedFile.writer().write("nested content");

  const content = await nestedFile.text();
  expect(content).toBe("nested content");
});
