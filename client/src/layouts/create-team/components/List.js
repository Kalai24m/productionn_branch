import React from "react";

function List({
  items,
  checkComplete,
  editItem,
  setIsEditing,
  isEditing,
  editValue,
  setEditValue,
  removeItem
}) {
  return (
    <div className="todo-list">
      {items.map((item) => {
        const { id, title } = item;
        return (
          <article className="list-item" key={id}>
            <li
              className="list-title"
              style={{
                textDecoration: item.complete ? "line-through" : "none"
              }}
            >
              <input
                type="checkbox"
                id="checkInput"
                checked={item.complete}
                onChange={() => {
                  checkComplete(id);
                }}
              />
              <label htmlFor="checkLabel"></label>
              {isEditing === id ? (
                <input
                  type="text"
                  id={id}
                  className="edit-input"
                  value={editValue}
                  name="editValue"
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                <div>{title}</div>
              )}
            </li>
            <div className="btn-container">
              {isEditing !== id ? (
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => setIsEditing(id)}
                >
                  edit
                </button>
              ) : (
                <button
                  type="button"
                  className="save-btn"
                  onClick={() => editItem(id)}
                >
                  save
                </button>
              )}
              <button
                type="button"
                className="delete-btn"
                onClick={() => removeItem(id)}
              >
                delete
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default List;
