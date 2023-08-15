import classNames from "classnames";
import { useStore } from "../store";
import "./Task.css";
import trash from "../assets/trash-2.svg";

type TaskProps = {
  title: string;
};

export default function Task({ title }: TaskProps) {
  const task = useStore((store) =>
    store.tasks.find((task) => task.title === title)
  );

  const setDraggedTask = useStore((store) => store.setDraggedTask);
  const draggedTask = useStore((store) => store.draggedTask);

  const deleteTask = useStore((store) => store.deleteTask);

  const moveTask = useStore((store) => store.moveTask);

  return (
    <div
      className="task"
      draggable
      onDragStart={() => setDraggedTask(task!.title)}
    >
      <div>{title}</div>
      <div className="bottomWrapper">
        <div className="">
          <img src={trash} alt="" onClick={() => deleteTask(task!.title)} />
        </div>
        <div className={classNames("status", task?.state)}>{task?.state}</div>
      </div>
    </div>
  );
}
