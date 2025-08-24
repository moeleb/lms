import React, { useEffect, useRef, useState } from "react";
import uniqid from "uniqid";
import Quill from "quill";
import "quill/dist/quill.snow.css"; // ✅ Quill styles
import { assets } from "../../assets/assets"; // ✅ Import your assets

const AddCourse = () => {
  const quillRef = useRef(null);
  const editorRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(null);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isFreePreview: false,
  });
  const [courseDescription, setCourseDescription] = useState("");

  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      const title = prompt("Enter Chapter Name:");
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder:
            chapters.length > 0
              ? chapters.slice(-1)[0].chapterOrder + 1
              : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === "remove") {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === "toggle") {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId
            ? { ...chapter, collapsed: !chapter.collapsed }
            : chapter
        )
      );
    }
  };

  const handleAddLecture = () => {
    if (!lectureDetails.lectureTitle || !lectureDetails.lectureUrl) {
      alert("Please fill lecture details");
      return;
    }
    setChapters(
      chapters.map((chapter) =>
        chapter.chapterId === currentChapterId
          ? {
              ...chapter,
              chapterContent: [...chapter.chapterContent, lectureDetails],
            }
          : chapter
      )
    );
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isFreePreview: false,
    });
    setShowPopup(false);
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      quillRef.current.on("text-change", () => {
        setCourseDescription(quillRef.current.root.innerHTML);
      });
    }
  }, []);

  return (
    <div className="h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0">
      <form className="flex flex-col gap-4 max-w-md w-full text-gray-500">
        {/* Course Title */}
        <div className="flex flex-col gap-1">
          <p>Course Title</p>
          <input
            onChange={(e) => setCourseTitle(e.target.value)}
            value={courseTitle}
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Course Description */}
        <div className="flex flex-col gap-1">
          <p>Course Description</p>
          <div
            ref={editorRef}
            className="h-40 border border-gray-500 rounded px-2"
          ></div>
        </div>

        {/* Price + Thumbnail */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-1">
            <p>Course Price</p>
            <input
              onChange={(e) => setCoursePrice(e.target.value)}
              value={coursePrice}
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
              required
            />
          </div>

          <div className="flex md:flex-row flex-col items-center gap-3">
            <p>Course Thumbnail</p>
            <label
              htmlFor="thumbnailImage"
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={assets.file_upload_icon}
                alt="Upload"
                className="p-3 bg-blue-500 rounded"
              />
              <input
                type="file"
                id="thumbnailImage"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                hidden
              />
            </label>
            {image && (
              <img
                className="max-h-10 rounded border"
                src={URL.createObjectURL(image)}
                alt="Thumbnail preview"
              />
            )}
          </div>
        </div>

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <p>Discount %</p>
          <input
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
            type="number"
            placeholder="0"
            min={0}
            max={100}
            className="outline-none md:py-2.5 py-2 w-28 px-3 rounded border border-gray-500"
            required
          />
        </div>

        {/* Chapters */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div
              key={chapter.chapterId}
              className="bg-white border rounded-lg mb-4 shadow-sm hover:shadow-md transition-all"
            >
              {/* Chapter Header */}
              <div
                className="flex justify-between items-center p-4 border-b cursor-pointer"
                onClick={() => handleChapter("toggle", chapter.chapterId)}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={assets.dropdown_icon}
                    width={14}
                    alt=""
                    className={`transition-transform duration-200 ${
                      chapter.collapsed ? "-rotate-90" : "rotate-0"
                    }`}
                  />
                  <span className="font-semibold text-gray-800">
                    {chapterIndex + 1}. {chapter.chapterTitle}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {chapter.chapterContent.length} Lectures
                </span>
                <img
                  className="cursor-pointer w-4 opacity-70 hover:opacity-100"
                  src={assets.cross_icon}
                  alt="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChapter("remove", chapter.chapterId);
                  }}
                />
              </div>

              {/* Chapter Content */}
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.length > 0 ? (
                    chapter.chapterContent.map((lecture, lectureIndex) => (
                      <div
                        key={lectureIndex}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <span className="text-gray-700">
                          <span className="font-medium">
                            {lectureIndex + 1}. {lecture.lectureTitle}
                          </span>{" "}
                          <span className="text-sm text-gray-500">
                            ({lecture.lectureDuration} mins)
                          </span>{" "}
                          –{" "}
                          <a
                            href={lecture.lectureUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-500 underline"
                          >
                            Link
                          </a>{" "}
                          –{" "}
                          <span
                            className={`${
                              lecture.isFreePreview
                                ? "text-green-600 font-medium"
                                : "text-gray-600"
                            }`}
                          >
                            {lecture.isFreePreview ? "Free Preview" : "Paid"}
                          </span>
                        </span>
                        <img
                          className="cursor-pointer w-4 opacity-70 hover:opacity-100"
                          src={assets.cross_icon}
                          alt="Delete Lecture"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 italic">No lectures yet</p>
                  )}

                  <div
                    className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 font-medium px-3 py-2 rounded mt-3 cursor-pointer hover:bg-blue-100 transition-all"
                    onClick={() => {
                      setCurrentChapterId(chapter.chapterId);
                      setShowPopup(true);
                    }}
                  >
                    + Add Lecture
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Chapter Button */}
          <div
            onClick={() => handleChapter("add")}
            className="flex justify-center items-center bg-blue-500 text-white font-medium px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all"
          >
            + Add Chapter
          </div>
        </div>

        {/* Popup Modal for Lecture */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white text-gray-700 p-6 rounded-lg relative w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Add Lecture</h2>

              <div className="mb-3">
                <p>Lecture Title</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-2 px-3"
                  value={lectureDetails.lectureTitle}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureTitle: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <p>Duration (minutes)</p>
                <input
                  type="number"
                  className="mt-1 block w-full border rounded py-2 px-3"
                  value={lectureDetails.lectureDuration}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureDuration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-3">
                <p>Lecture URL</p>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded py-2 px-3"
                  value={lectureDetails.lectureUrl}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      lectureUrl: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-2 items-center my-4">
                <p>Is Preview Free?</p>
                <input
                  type="checkbox"
                  className="scale-125"
                  checked={lectureDetails.isFreePreview}
                  onChange={(e) =>
                    setLectureDetails({
                      ...lectureDetails,
                      isFreePreview: e.target.checked,
                    })
                  }
                />
              </div>

              <button
                type="button"
                onClick={handleAddLecture}
                className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add Lecture
              </button>

              <img
                onClick={() => setShowPopup(false)}
                src={assets.cross_icon}
                className="absolute top-4 right-4 w-4 cursor-pointer"
                alt="Close"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          className="bg-black text-white w-max py-2.5 px-8 rounded my-4"
        >
          ADD
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
