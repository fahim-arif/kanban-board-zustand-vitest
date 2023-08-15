import { produce } from "immer";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type TaskType = {
  title: string;
  state: "PLANNED" | "ONGOING" | "DONE";
};

type Store = {
  tasks: TaskType[];
  addTask: (title: string, state: "PLANNED" | "ONGOING" | "DONE") => void;
  deleteTask: (title: string) => void;
  draggedTask: string | null;
  setDraggedTask: (draggedTask: string) => void;
  moveTask: (title: string, state: "PLANNED" | "ONGOING" | "DONE") => void;
};

const store = (set: any): Store => ({
  tasks: [],
  draggedTask: null,
  setDraggedTask: (title) => set({ draggedTask: title }),

  addTask: (title, state) =>
    set(
      produce((store: Store) => {
        store.tasks.push({ title, state });
      }),
      // (prevState: Store) => ({
      //   tasks: [...prevState.tasks, { title, state }],
      // }),
      false,
      "addTask"
    ),
  deleteTask: (title) =>
    set((prevState: Store) => ({
      tasks: prevState.tasks.filter((task) => task.title !== title),
    })),
  moveTask: (title, state) =>
    set((store) => ({
      tasks: store.tasks.map((task) =>
        task.title === title ? { ...task, state } : task
      ),
    })),
});

// const log =
//   (config: any, state: any, type: any) => (set: any, get: any, api: any) =>
//     config(
//       (...args: any) => {
//         console.log(type, args);
//         set(...args);
//         console.log("New state:", get());
//       },
//       state,
//       type,
//       api
//     );

const log = (config) => (set, get, api) =>
  config(
    (...args) => {
      console.log(args);
      set(...args);
    },
    get,
    api
  );

export const useStore = create(
  log(persist(devtools<Store>(store), { name: "kanban-board" }))
);
