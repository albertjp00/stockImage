import { useEffect, useState } from "react";
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
  const [loading , setLoading] = useState(true)

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
    try {
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
    } catch (error) {
      console.log(error);
    }
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
      }finally{
        setLoading(false)
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

  if(loading){
    return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );
  }else{

  return (

    
    <div className="p-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Images</h2>

        <div className="flex gap-3">
          <button
            onClick={saveOrder}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save Order
          </button>

          {files.length === 0 ? (
            <label className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer">
              + Add Images
              <input type="file" multiple onChange={handleFileChange} hidden />
            </label>
          ) : (
            <button
              onClick={handleCancelUpload}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {files.length > 0 && (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex gap-3 items-center">
              <p className="w-40 truncate">{file.name}</p>

              <input
                type="text"
                placeholder="Enter image title"
                value={titles[index]}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                className="border px-3 py-2 rounded-lg w-full"
              />
            </div>
          ))}

          {error && <p className="text-red-500">{error}</p>}

          <button
            onClick={handleUpload}
            className="bg-black text-white px-4 py-2 rounded-lg"
          >
            Upload
          </button>
        </div>
      )}

      {/* Image Grid */}
      <div className="mt-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="images">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {images.map((img, index) => (
                  <Draggable key={img._id} draggableId={img._id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white shadow-md rounded-xl overflow-hidden p-2"
                      >
                        <img
                          src={`${import.meta.env.VITE_API_URL}/assets/${img.image}`}
                          className="w-full h-40 object-cover rounded-md"
                        />

                        <p className="mt-2 font-medium text-center">
                          {img.title}
                        </p>

                        <div className="flex justify-center gap-2 mt-3">
                          <button
                            onClick={() => openEditModal(img)}
                            className="bg-yellow-400 hover:bg-yellow-500 px-3 py-1 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => openDeleteModal(img._id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                          >
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

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="text-lg font-semibold mb-4">Edit Image Title</h3>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="border w-full px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveEdit}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h3 className="text-lg font-semibold mb-2">Delete Image</h3>
            <p className="mb-4">Are you sure you want to delete this image?</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
};

export default ImageGallery;
