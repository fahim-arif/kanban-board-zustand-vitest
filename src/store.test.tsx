import { useEffect } from "react";
import { useStore } from "./store";
import { vi } from "vitest";
import { render } from "@testing-library/react";
import store from "./store";

vi.mock("zustand");

function TestComponent({ selector, effect }) {
  const item = useStore(selector);

  useEffect(effect, [item]);
  return null;
}

test("should return default value", () => {
  const selector = (state) => state.tasks;
  const effect = vi.fn();

  render(<TestComponent selector={selector} effect={effect} />);
  expect(effect).toHaveBeenCalledWith([]);
});

test("should add an items to the store and rerun the effect", () => {
  const selector = (state) => ({
    tasks: state.tasks,
    addTask: store.addTask,
    deleteTask: store.deleteTask,
  });

  let createdTask = false;
  let currentItems = [];

  const effect = vi.fn().mockImplementation((items) => {
    currentItems = items;
    if (!createdTask) {
      items.addTask("task 1", "PLANNED");
      createdTask = true;
    } else if (items.length === 1) {
      items.deleteTask("task 1");
    }
  });

  render(<TestComponent selector={selector} effect={effect} />);
  expect(effect).toHaveBeenCalledTimes(3);
  // expect(effect).toHaveBeenCalledWith({
  //   tasks: [[{ title: "task 1", state: "PLANNED" }], expect.any(Function)],
  // });
  expect(currentItems.tasks).toEqual([]);
});

// test("Sample test", () => {
//   expect(1).toBe(1);
// });
