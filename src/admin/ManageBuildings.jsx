import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import {
  DndContext,
  closestCenter
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { getPgs, addPg, updatePg, deletePg } from "../api/pgService";
import "./ManageBuildings.css";

/* ================= SORTABLE ITEM ================= */

function SortableImage({ image, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="preview-box">
      <img src={image.src} alt="" />
      <button type="button" onClick={onRemove}>✕</button>
      <div className="drag-handle" {...attributes} {...listeners}>⋮⋮</div>
    </div>
  );
}

/* ================= PAGE ================= */

export default function ManageBuildings() {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editPg, setEditPg] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    totalFloors: "",
  });

  // 🔥 SINGLE SOURCE OF TRUTH
  const [images, setImages] = useState([]);

  const load = async () => {
    const res = await getPgs();
    setPgs(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setEditPg(null);
    setForm({ name: "", location: "", totalFloors: "" });
    setImages([]);
  };

  const openAdd = () => {
    reset();
    setShowModal(true);
  };

  const openEdit = (pg) => {
    setEditPg(pg);
    setForm({
      name: pg.name,
      location: pg.location,
      totalFloors: pg.totalFloors,
    });

    setImages(
      (pg.images || []).map((src) => ({
        id: crypto.randomUUID(),
        type: "existing",
        src,
      }))
    );

    setShowModal(true);
  };

  const closeModal = () => {
    reset();
    setShowModal(false);
  };

  /* ================= IMAGES ================= */

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);

    const newItems = files.map((file) => ({
      id: crypto.randomUUID(),
      type: "new",
      file,
      src: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newItems]);
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setImages((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  /* ================= SUBMIT ================= */

  const submit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const existingImages = images
      .filter((i) => i.type === "existing")
      .map((i) => i.src);

    formData.append(
      "pg",
      JSON.stringify({
        ...form,
        totalFloors: Number(form.totalFloors),
        images: existingImages,
      })
    );

    images
      .filter((i) => i.type === "new")
      .forEach((i) => formData.append("images", i.file));

    if (editPg) {
      await updatePg(editPg.id, formData);
    } else {
      await addPg(formData);
    }

    closeModal();
    load();
  };

  const removePg = async (id) => {
    if (window.confirm("Delete building?")) {
      await deletePg(id);
      load();
    }
  };

  return (
    <div className="buildings-page">
      <div className="buildings-header">
        <div>
          <h2>Buildings</h2>
          <p className="muted">Manage PG buildings</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          + Add Building
        </button>
      </div>

      <div className="buildings-card">
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Floors</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pgs.map((pg) => (
                <tr key={pg.id}>
                  <td>{pg.name}</td>
                  <td>{pg.location}</td>
                  <td>{pg.totalFloors}</td>
                  <td className="actions">
                    <button className="icon-btn edit" onClick={() => openEdit(pg)}>✏️</button>
                    <button className="icon-btn delete" onClick={() => removePg(pg.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <BuildingModal
          form={form}
          setForm={setForm}
          images={images}
          onFileChange={onFileChange}
          removeImage={removeImage}
          onDragEnd={onDragEnd}
          onClose={closeModal}
          onSubmit={submit}
          editPg={editPg}
        />
      )}
    </div>
  );
}

/* ================= MODAL ================= */

function BuildingModal({
  editPg,
  form,
  setForm,
  images,
  onFileChange,
  removeImage,
  onDragEnd,
  onClose,
  onSubmit,
}) {
  return ReactDOM.createPortal(
    <div className="pg-modal-overlay">
      <div className="pg-modal">
        <div className="pg-modal-header">
          <h3>{editPg ? "Edit Building" : "Add Building"}</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <form className="pg-modal-body" onSubmit={onSubmit}>
          <input value={form.name} placeholder="Building Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })} required />

          <input value={form.location} placeholder="Location"
            onChange={(e) => setForm({ ...form, location: e.target.value })} required />

          <input type="number" value={form.totalFloors} placeholder="Total Floors"
            onChange={(e) => setForm({ ...form, totalFloors: e.target.value })} required />

          <input type="file" multiple accept="image/*" onChange={onFileChange} />

          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={images.map((i) => i.id)} strategy={rectSortingStrategy}>
              <div className="image-preview-grid">
                {images.map((img) => (
                  <SortableImage
                    key={img.id}
                    image={img}
                    onRemove={() => removeImage(img.id)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="pg-modal-footer">
            <button className="btn-primary">{editPg ? "Update" : "Create"}</button>
            <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
