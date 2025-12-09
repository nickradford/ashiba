import { describe, it, expect } from "bun:test";
import { render } from "@inquirer/testing";
import numberWheel from "./number-wheel";

describe("number-wheel component", () => {
  it("handles simple use case with arrow keys", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Select a value",
    });
    expect(getScreen()).toContain("Select a value 0");
    events.keypress("up");
    expect(getScreen()).toContain("Select a value 1");
    events.keypress("down");
    expect(getScreen()).toContain("Select a value 0");
    events.keypress("enter");
    expect(answer).resolves.toEqual(0);
  });

  it("increments with up arrow", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Pick a number",
      default: 5,
    });
    expect(getScreen()).toContain("Pick a number 5");
    events.keypress("up");
    expect(getScreen()).toContain("Pick a number 6");
    events.keypress("up");
    expect(getScreen()).toContain("Pick a number 7");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(7);
  });

  it("decrements with down arrow", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Pick a number",
      default: 5,
    });
    expect(getScreen()).toContain("Pick a number 5");
    events.keypress("down");
    expect(getScreen()).toContain("Pick a number 4");
    events.keypress("down");
    expect(getScreen()).toContain("Pick a number 3");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(3);
  });

  it("respects min/max bounds", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Pick a number",
      default: 1,
      min: 0,
      max: 5,
    });
    expect(getScreen()).toContain("Pick a number 1");
    events.keypress("down");
    events.keypress("down");
    events.keypress("down");
    // Should stop at min (0)
    expect(getScreen()).toContain("Pick a number 0");
    events.keypress("up");
    events.keypress("up");
    events.keypress("up");
    events.keypress("up");
    events.keypress("up");
    events.keypress("up");
    events.keypress("up");
    // Should stop at max (5)
    expect(getScreen()).toContain("Pick a number 5");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(5);
  });

  it("respects custom interval", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Pick a multiple of 5",
      default: 0,
      interval: 5,
    });
    expect(getScreen()).toContain("Pick a multiple of 5 0");
    events.keypress("up");
    expect(getScreen()).toContain("Pick a multiple of 5 5");
    events.keypress("up");
    expect(getScreen()).toContain("Pick a multiple of 5 10");
    events.keypress("down");
    expect(getScreen()).toContain("Pick a multiple of 5 5");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(5);
  });

  it("allows direct numeric input with timeout", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Enter a number",
    });
    expect(getScreen()).toContain("Enter a number 0");
    events.type("4");
    expect(getScreen()).toContain("Enter a number 4");
    events.type("2");
    expect(getScreen()).toContain("Enter a number 42");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(42);
  });

  it("clears input buffer when using arrow keys", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Enter a number",
    });
    events.type("5");
    expect(getScreen()).toContain("Enter a number 5");
    events.keypress("up");
    expect(getScreen()).toContain("Enter a number 6");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(6);
  });

  it("shows correct help text while idle", async () => {
    const { getScreen } = await render(numberWheel, {
      message: "Pick a number",
    });
    const screen = getScreen();
    expect(screen).toContain("↑↓ +/- • ⏎ select");
  });

  it("hides help text when done", async () => {
    const { events, getScreen } = await render(numberWheel, {
      message: "Pick a number",
    });
    events.keypress("enter");
    const screen = getScreen();
    expect(screen).not.toContain("↑↓ +/- • ⏎ select");
  });

  it("handles default value", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Pick a number",
      default: 42,
    });
    expect(getScreen()).toContain("Pick a number 42");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(42);
  });

  it("ignores non-numeric input", async () => {
    const { answer, events, getScreen } = await render(numberWheel, {
      message: "Pick a number",
      default: 5,
    });
    events.type("abc");
    // Should remain at default since non-numeric input is ignored
    expect(getScreen()).toContain("Pick a number 5");
    events.type("3");
    expect(getScreen()).toContain("Pick a number 3");
    events.keypress("enter");
    await expect(answer).resolves.toEqual(3);
  });
});
