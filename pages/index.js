import Head from "next/head";
import React, { useRef, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import usePrevious from "../hooks/usePrevious";
import Todo from "../components/Todo";
import Form from "../components/Form";
import FilterButton from "../components/FilterButton";
import axios from "axios";

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

// page
export default function Home({ todos }) {
  const [tasks, setTasks] = useState(todos);
  const [filter, setFilter] = useState("All");
  const listHeadingRef = useRef(null);

  const prevTaskLength = usePrevious(tasks.length);

  function addTask(title) {
    const newTask = { id: "task-" + nanoid(), title: title, completed: false };
    setTasks([...tasks, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, title: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        title={task.title}
        completed={task.completed}
        key={task.id}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
      />
    ));

  const filterList = FILTER_NAMES.map((title) => (
    <FilterButton
      key={title}
      title={title}
      isPressed={title === filter}
      setFilter={setFilter}
    />
  ));

  const taskNoun = taskList.length === 1 ? "task" : "tasks";
  const headingText = `${taskList.length} ${taskNoun} remaining`;

  useEffect(() => {
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div>
      <Head>
        <title>Todo Website</title>
        <meta name="description" content="A Todo website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="todoapp stack-large">
        <h1>Todo</h1>

        <Form addTask={addTask} />
        <div className="filters btn-group stack-exception">{filterList}</div>

        <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
          {headingText}
        </h2>

        <ul
          role="list"
          className="todo-list stack-large stack-exception"
          aria-labelledby="list-heading"
        >
          {taskList}
        </ul>
      </div>
      <footer>
        Made by{" "}
        <a href="https://github.com/Michaeloye" target="blank">
          {" "}
          Oyebadejo Michael
        </a>
        ✌️
      </footer>
    </div>
  );
}

export const getServerSideProps = async () => {
  try {
    const data = await axios.get("https://jsonplaceholder.typicode.com/todos");
    return {
      props: {
        // get only todos equivalent to userId = 1
        todos: data.data.filter((datum) => datum.userId === 1),
      },
    };
  } catch (err) {
    console.log(err);
    return {
      props: {
        todos: [],
      },
    };
  }
};
