import React, { useState, useEffect } from "react";

function Form(props) {
  const [title, setTitle] = useState("");

  function handleChange(e) {
    setTitle(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    try {
      if (!title) throw Error("An empty task cannot be assigned");
      else props.addTask(title);
    } catch (err) {
      console.log(err);
    }
    setTitle("");
  }
  useEffect(() => {
    document.title = "Todo";
  });
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={title}
        onChange={handleChange}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
