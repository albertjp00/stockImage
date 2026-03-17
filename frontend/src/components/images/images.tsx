import { useEffect, useState } from "react";
import "./images.css";
import {
  addImage,
  changeOrder,
  deleteImage,
  editImage,
  getImages,
} from "../../assets/services/services";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";

export interface ImageItem {
  _id: string;
  title: string;
  image: string;
  order?: number;
}

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    if (!selectedFiles.length) return;

    setFiles(selectedFiles);

    setTitles(new Array(selectedFiles.length).fill(""));
  };

  const handleTitleChange = (index: number, value: string) => {
    const updatedTitles = [...titles];
    updatedTitles[index] = value;

    const duplicate = updatedTitles.filter(
      (title, i) => title === value && i !== index && value !== "",
    );

    if (duplicate.length > 0) {
      setError("Duplicate titles are not allowed");
    } else {
      setError("");
    }

    setTitles(updatedTitles);
  };

  const handleUpload = async () => {
    if (titles.some((t) => !t.trim())) {
      setError("All images must have a title");
      return;
    }

    const uniqueTitles = new Set(titles);
    if (uniqueTitles.size !== titles.length) {
      setError("Duplicate titles are not allowed");
      return;
    }

    const existingTitles = images.map((img) => img.title.toLowerCase());

    const duplicate = titles.find((title) =>
      existingTitles.includes(title.toLowerCase()),
    );

    if (duplicate) {
      setError(`"${duplicate}" already exists`);
      return;
    }

    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("titles", titles[index]);
      formData.append("images", file);
    });

    const res = await addImage(formData);
    if (!res.data.success) {
      setError(res.data.message);
    }

    const newImages = files.map((file, index) => ({
      title: titles[index],
      image: URL.createObjectURL(file),
    }));

    const formattedImages = newImages.map((img) => ({
      _id: crypto.randomUUID(),
      title: img.title,
      image: img.image,
    }));

    setImages((prev) => [...prev, ...formattedImages]);
    setFiles([]);
    setTitles([]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(images);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImages(items);
  };

  useEffect(() => {
    const fetchImages = async (page: number) => {
      try {
        const res = await getImages(page);
        console.log(res);

        if (res.data.success) {
          setImages(res.data.images);
          setTotalPages(res.data.totalPages);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchImages(page);
  }, [files, page]);

  const handleCancelUpload = () => {
    setFiles([]);
    setTitles([]);
    setError("");
  };

  const saveOrder = async () => {
    const reordered = images.map((img, index) => ({
      id: img._id,
      order: index,
    }));

    await changeOrder(reordered);
    toast.success("order saved");
  };

  const handleSaveEdit = async () => {
    if (!editId) return;

    try {
      const res = await editImage(editId, editTitle);

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setImages((prev) =>
        prev.map((img) =>
          img._id === editId ? { ...img, title: editTitle } : img,
        ),
      );

      toast.success("Image updated");
      closeModal();
    } catch (err) {
      console.log(err);
      toast.error("Edit failed");
    }
  };

  const openEditModal = (img: ImageItem) => {
    setEditId(img._id);
    setEditTitle(img.title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setEditTitle("");
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

const confirmDelete = async () => {
  if (!deleteId) return;

  try {
    const res = await deleteImage(deleteId);

    if (!res.data.success) {
      toast.error(res.data.message);
      return;
    }

    setImages((prev) => prev.filter((img) => img._id !== deleteId));

    toast.success("Image deleted");
    closeDeleteModal();
  } catch (err) {
    console.log(err);
    toast.error("Delete failed");
  }
};

  return (
    <div className="gallery-container">
      <div className="gallery-header">
        <h2>My Images</h2>
        <button className="img-grid-btn" onClick={saveOrder}>
          Save Order
        </button>

        {files.length === 0 ? (
          <label className="upload-btn">
            + Add Images
            <input type="file" multiple onChange={handleFileChange} hidden />
          </label>
        ) : (
          <button
            className="upload-btn cancel-btn"
            onClick={handleCancelUpload}
          >
            Cancel
          </button>
        )}
      </div>

      {files.length > 0 && (
        <div className="upload-section">
          {/* <p>Cancel</p> */}
          {files.map((file, index) => (
            <div key={index} className="upload-item">
              <p>{file.name}</p>

              <input
                type="text"
                placeholder="Enter image title"
                value={titles[index]}
                onChange={(e) => handleTitleChange(index, e.target.value)}
              />
            </div>
          ))}
          {error && <p className="error">{error}</p>}
          <button onClick={handleUpload}>Upload</button>
        </div>
      )}

      <div className="image-grid">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {images.map((img, index) => (
                  <Draggable key={img._id} draggableId={img._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <img
                          className="img"
                          src={`${import.meta.env.VITE_API_URL}/assets/${img.image}`}
                        />

                        <p>{img.title}</p>

                        <div className="img-actions">
                          <button onClick={() => openEditModal(img)}>
                            Edit
                          </button>
                          <button onClick={() => openDeleteModal(img._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Edit Image Title</h3>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>
                Cancel
              </button>

              <button className="save-btn" onClick={handleSaveEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Image</h3>
            <p>Are you sure you want to delete this image?</p>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeDeleteModal}>
                Cancel
              </button>

              <button className="delete-btn" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
