
import React, { useEffect, useMemo, useState } from "react";
import "./Buoi3.css";

/* ====== DATA MẪU ====== */
const initialTodos = [
  { id: 1, title: "Go to supermarket", done: false },
  { id: 2, title: "Do my homework", done: true },
  { id: 3, title: "Play game", done: false },
  { id: 4, title: "Read novel", done: false },
];

const STORAGE_KEY = "buoi3_todos_v1";

/* ====== ICONS (SVG) ====== */
const PlusIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z" />
  </svg>
);

const TrashIcon = ({ size = 18 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <rect x="5" y="6" width="14" height="14" rx="2" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const EditIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
  </svg>
);

const SaveIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
    <path d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4zM5 19V5h10v4h4v10H5zm3-6h8v2H8v-2zm0-4h6v2H8V9z"/>
  </svg>
);

const FILTERS = {
  ALL: "all",
  DONE: "done",
  INPROGRESS: "inprogress",
};

export default function App() {
  const [todos, setTodos] = useState(initialTodos);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(FILTERS.ALL);

  // --- Modal "Create" ---
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createTitle, setCreateTitle] = useState("");

  // --- Edit state ---
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  /* ==== PERSISTENCE (localStorage) ==== */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTodos(parsed);
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTodos));
      }
    } catch (e) {
      console.error("localStorage read error:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (e) {
      console.error("localStorage write error:", e);
    }
  }, [todos]);

  /* ==== FILTERED LIST ==== */
  const filteredTodos = useMemo(() => {
    const byText = todos.filter(t =>
      t.title.toLowerCase().includes(search.trim().toLowerCase())
    );
    switch (filter) {
      case FILTERS.DONE:        return byText.filter(t => t.done);
      case FILTERS.INPROGRESS:  return byText.filter(t => !t.done);
      default:                  return byText;
    }
  }, [todos, search, filter]);

  /* ==== HANDLERS ==== */
  // Open modal
  const openCreateModal = () => {
    setCreateTitle("");
    setShowCreateModal(true);
  };
  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateTitle("");
  };

  // Save new todo from modal
  const saveNewTodo = () => {
    const title = createTitle.trim();
    if (!title) {
      alert("Vui lòng nhập nội dung todo.");
      return;
    }
    setTodos(prev => [
      ...prev,
      { id: crypto?.randomUUID?.() ?? Date.now(), title, done: false }
    ]);
    closeCreateModal();
  };

  const handleToggle = (id) => {
    setTodos(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const handleDelete = (id) => {
    const target = todos.find(t => t.id === id);
    if (!target) return;
    const ok = window.confirm(`Bạn có chắc muốn xóa: "${target.title}"?`);
    if (ok) setTodos(prev => prev.filter(t => t.id !== id));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };
  const saveEdit = () => {
    const title = editingTitle.trim();
    if (!title) {
      alert("Tên todo không được rỗng.");
      return;
    }
    setTodos(prev => prev.map(t => (t.id === editingId ? { ...t, title } : t)));
    cancelEdit();
  };

  // Keyboard inside modal
  const handleCreateKeyDown = (e) => {
    if (e.key === "Enter") saveNewTodo();
    if (e.key === "Escape") closeCreateModal();
  };

  return (
    <div className="todo-app">
      <div className="todo-card">
        <h1 className="todo-title">TODO</h1>

        {/* Search + Create button (open modal) */}
        <div className="row gap">
          <input
            className="input"
            placeholder="Input search key"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="create-wrap">
            {/* Nút Create bây giờ chỉ mở modal */}
            <button className="btn btn-primary" onClick={openCreateModal} title="Create new todo">
              <PlusIcon />
              <span className="btn-text">Create</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <button
            className={`btn btn-chip ${filter === FILTERS.ALL ? "active" : ""}`}
            onClick={() => setFilter(FILTERS.ALL)}
            aria-pressed={filter === FILTERS.ALL}
          >
            All
          </button>
          <button
            className={`btn btn-chip ${filter === FILTERS.DONE ? "active" : ""}`}
            onClick={() => setFilter(FILTERS.DONE)}
            aria-pressed={filter === FILTERS.DONE}
          >
            Done
          </button>
          <button
            className={`btn btn-chip ${filter === FILTERS.INPROGRESS ? "active" : ""}`}
            onClick={() => setFilter(FILTERS.INPROGRESS)}
            aria-pressed={filter === FILTERS.INPROGRESS}
          >
            In‑progress
          </button>
        </div>

        {/* List */}
        <ul className="todo-list">
          {filteredTodos.map((todo) => {
            const isEditing = editingId === todo.id;
            return (
              <li key={todo.id} className={`todo-item ${todo.done ? "done" : ""}`}>
                <div
                  className="todo-label"
                  onClick={() => !isEditing && handleToggle(todo.id)}
                  role="button"
                  title={todo.done ? "Đã hoàn thành - click để bỏ hoàn thành" : "Click để đánh dấu hoàn thành"}
                >
                  {isEditing ? (
                    <input
                      className="input edit-input"
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                    />
                  ) : (
                    <span className="todo-text">{todo.title}</span>
                  )}
                </div>

                <div className="todo-actions">
                  <button
                    className="btn btn-danger icon"
                    onClick={() => handleDelete(todo.id)}
                    title="Xóa"
                    aria-label="Delete todo"
                  >
                    <TrashIcon />
                  </button>

                  {isEditing ? (
                    <button
                      className="btn btn-secondary icon"
                      onClick={saveEdit}
                      title="Lưu"
                      aria-label="Save todo"
                    >
                      <SaveIcon />
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary icon"
                      onClick={() => startEdit(todo)}
                      title="Sửa"
                      aria-label="Edit todo"
                    >
                      <EditIcon />
                    </button>
                  )}
                </div>
              </li>
            );
          })}

          {filteredTodos.length === 0 && (
            <li className="empty">Không có todo nào phù hợp.</li>
          )}
        </ul>
      </div>

      {/* ===== Modal Create ===== */}
      {showCreateModal && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains("modal-backdrop")) {
              // Click ra ngoài để đóng
              closeCreateModal();
            }
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="create-title">
            <div className="modal-header">
              <h2 id="create-title">Thêm Todo</h2>
            </div>
            <div className="modal-body">
              <label className="modal-label" htmlFor="create-input">Nội dung</label>
              <input
                id="create-input"
                className="input"
                placeholder="Nhập nội dung todo..."
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                autoFocus
                onKeyDown={handleCreateKeyDown}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeCreateModal}>Cancel (Esc)</button>
              <button className="btn btn-primary" onClick={saveNewTodo}>
                <SaveIcon /> <span className="btn-text">Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
