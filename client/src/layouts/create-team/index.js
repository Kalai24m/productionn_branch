import React, { useState, useEffect } from "react";
import List from "layouts/create-team/components/List";
import Alert from "layouts/create-team/components/Alerts";
import "./styles.css";

function Team() {
  const [title, setTitle] = useState("");
  const [isEditing, setIsEditing] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [alert, setAlert] = useState({ show: false, msg: "", type: "" });
  const [lists, setLists] = useState([
    { id: 1, title: "team1", complete: false },
    { id: 2, title: "team2", complete: false },

  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) {
      showAlert(true, "danger", "please enter!");
      setTitle("");
    } else {
      showAlert(true, "success", "Team has been added!");
      const newItem = {
        id: new Date().getTime(),
        title: title,
        complete: false
      };
      setEditValue(title);
      setLists([...lists, newItem]);
      setTitle("");
      setIsEditing(null);
    }
  };
  // checkbox
  const checkComplete = (id) => {
    const checkItem = [...lists];
    checkItem.forEach((item) => {
      if (id === item.id) {
        item.complete = !item.complete;
      }
      setLists(checkItem);
      setIsEditing(null);
    });
  };
  const showAlert = (show = false, type = "", msg = "") => {
    setAlert({ show, type, msg });
  };
  //clear all items
  const clearList = () => {
    showAlert(true, "danger", "All Team cleared!");
    setLists([]);
  };
  //remove item
  const removeItem = (id) => {
    showAlert(true, "danger", "The selected team has been deleted!");
    setLists(lists.filter((item) => item.id !== id));
    setIsEditing(null);
  };
  //edit
  const editItem = (id) => {
    showAlert(true, "success", "Team has been modified!");
    const todoItem = [...lists].map((item) => {
      if (item.id === id) {
        item.title = editValue;
      }
      return item;
    });
    setLists(todoItem);
    setIsEditing(null);
    // setEditValue("");
  };

  //LocalStorage
  // useEffect(() => {
  //   const getLocalStorage = localStorage.getItem("lists");
  //   const loaded = JSON.parse(getLocalStorage);
  //   if (loaded) {
  //     setLists(loaded);
  //   }
  // }, []);
  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && (
          <Alert {...alert} removeAlert={showAlert} lists={lists} />
        )}
        <h1>Team List</h1>
        <div className="form-control">
          <input
            type="text"
            className="add-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" className="add-btn">
            ADD
          </button>
        </div>
      </form>
      {lists.length > 0 && (
        <div className="lists-container">
          <List
            items={lists}
            checkComplete={checkComplete}
            setIsEditing={setIsEditing}
            editItem={editItem}
            editValue={editValue}
            setEditValue={setEditValue}
            isEditing={isEditing}
            removeItem={removeItem}
          />
          <button className="clear-btn" onClick={clearList}>
            clear All
          </button>
        </div>
      )}
    </section>
  );
}

export default Team;
