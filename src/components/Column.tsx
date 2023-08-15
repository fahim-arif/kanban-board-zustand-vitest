import { useStore } from "../store";
import Task from "./Task";
import "./Column.css";
import { useState } from "react";
import classNames from "classnames";
// import { shallow } from "zustand/shallow";

type ColumnProps = {
  state: "PLANNED" | "ONGOING" | "DONE";
};

export default function Column({ state }: ColumnProps) {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState(false);

  const tasks = useStore((store) =>
    store.tasks.filter((task) => task.state === state)
  );

  const addTask = useStore((store) => store.addTask);

  const draggedTask = useStore((store) => store.draggedTask);
  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const moveTask = useStore((store) => store.moveTask);

  return (
    <div
      className={classNames("column", { drop })}
      onDragOver={(e) => {
        setDrop(true);
        e.preventDefault();
      }}
      onDragLeave={(e) => {
        setDrop(false);
        e.preventDefault();
      }}
      onDrop={(e) => {
        setDrop(false);
        moveTask(draggedTask!, state);
        return setDraggedTask(null);
        // console.log(draggedTask);
      }}
    >
      <p>{state}</p>
      <button onClick={() => setOpen(true)}>Add</button>
      {tasks.map((task) => (
        <Task title={task.title} key={task.title} />
      ))}
      {open && (
        <div className="Modal">
          <div className="modalContent">
            <input
              type="text"
              onChange={(e) => setText(e.target.value)}
              value={text}
            />
            <button
              onClick={() => {
                addTask(text, state);
                setOpen(false);
                setText("");
              }}
            >
              Submit
            </button>
            <button
              onClick={() => {
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
