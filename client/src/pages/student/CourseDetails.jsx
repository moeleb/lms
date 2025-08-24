import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import Youtube from "react-youtube"

const CourseDetails = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const { 
    currency, 
    allCourses, 
    calculateRating, 
    caluclateChapterTime, 
    calculateCourseDuration, 
    caluclateNoOfLectures 
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    const findCourse = allCourses.find((course) => course._id === id);
    setCourseData(findCourse);
  };

  useEffect(() => {
    fetchCourseData();
  }, [allCourses, id]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      {/* Background gradient */}
      <div className="absolute top-0 left-0 w-full h-[500px] -z-10 bg-gradient-to-b from-cyan-100/70 to-white"></div>

      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-6 md:pt-32 pt-20 text-left">
        
        {/* Left Side: Course Info */}
        <div className="max-w-2xl z-10 text-gray-600">
          {/* Title */}
          <h1 className="font-semibold text-gray-900 text-3xl md:text-4xl">
            {courseData.courseTitle}
          </h1>

          {/* Short Description */}
          <p
            className="mt-3 text-gray-600 text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription.slice(0, 200) }}
          ></p>

          {/* Ratings + Students */}
          <div className="flex items-center space-x-3 pt-4 pb-2 text-sm">
            <p className="font-medium">{calculateRating(courseData).toFixed(1)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  className="w-4 h-4"
                  key={i}
                  src={i < Math.floor(calculateRating(courseData)) ? assets.star : assets.star_blank}
                  alt="rating star"
                />
              ))}
            </div>
            <p className="text-blue-600">
              {courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"}
            </p>
            <p>
              {courseData.enrolledStudents.length}{" "}
              {courseData.enrolledStudents.length > 1 ? "students" : "student"}
            </p>
          </div>

          {/* Author */}
          <p className="text-sm">
            Course By <span className="text-blue-600 underline">Me</span>
          </p>

          {/* Course Structure */}
          <div className="pt-8 text-gray-900">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5">
              {courseData.courseContent.map((chapter, index) => (
                <div
                  key={index}
                  className="border border-gray-200 bg-white mb-2 rounded-md shadow-sm"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => toggleSection(index)}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={assets.down_arrow_icon}
                        alt="toggle"
                        className={`w-4 h-4 transform transition-transform duration-300 ${
                          openSection[index] ? "rotate-180" : ""
                        }`}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {chapter.chapterContent.length} lectures • {caluclateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Accordion Body */}
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: openSection[index] ? "1000px" : "0px",
                    }}
                  >
                    <ul className="list-disc md:pl-10 pl-5 pr-4 py-2 text-gray-600 border-t border-gray-200">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li className="flex items-start gap-2 py-1" key={i}>
                          <img className="w-4 h-4 mt-1" src={assets.play_icon} alt="lecture" />
                          <div className="flex items-center justify-between text-gray-800 w-full text-xs md:text-base">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-3">
                              {lecture.isPreviewFree && (
                                <p  onClick={()=>setPlayerData({
                                  videoId : lecture.lectureUrl.split("/").pop(),

                                })} className="text-blue-500 cursor-pointer">Preview</p>
                              )}
                              <p>
                                {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                  units: ["h", "m"],
                                })}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Full Description */}
          <div className="pt-10">
            <h3 className="text-xl font-semibold">Course Description</h3>
            <p
              className="pt-3 rich-text"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            ></p>
          </div>
        </div>

        {/* Right Sidebar: Course Card */}
        <div className="max-w-course-card z-10 rounded-lg overflow-hidden bg-white shadow-md min-w-[300px] sm:min-w-[420px]">
              {
                playerData ? 
                <Youtube videoId={playerData.videoId} opts={{ playerVars:{autoplay : 1} }} iframeClassName="w-full aspect-ratio"></Youtube>
         :   <img src={courseData.courseThumbnail} alt="thumbnail" className="w-full" />

              }
          <div className="p-5">
            <div className="flex items-center gap-2">
              
               <img className="w-4" src={assets.time_left_clock_icon} alt="time left" />
           
              <p className="text-red-500 text-sm">
                <span className="font-medium">5 days left at this price</span>
              </p>
            </div>

            {/* Price */}
            <div className="flex gap-3 items-center pt-3">
              <p className="text-gray-900 text-2xl md:text-3xl font-semibold">
                {currency} {(courseData.coursePrice - (courseData.discount * courseData.coursePrice) / 100).toFixed(2)}
              </p>
              <p className="text-gray-500 line-through">{currency}{courseData.coursePrice}</p>
              <p className="text-gray-500">{courseData.discount}% off</p>
            </div>

            {/* Stats */}
            <div className="flex items-center text-sm gap-4 pt-4 text-gray-600">
              <div className="flex items-center gap-1">
                <img src={assets.star} alt="star" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <img src={assets.time_clock_icon} alt="duration" />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex items-center gap-1">
                <img src={assets.lesson_icon} alt="lessons" />
                <p>{caluclateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <button className="md:mt-6 mt-4 w-full py-3 rounded bg-blue-600 text-white font-medium">{isAlreadyEnrolled? 'Already Enrolled' : 'Enroll now'}</button>
              <div className="pt-6">
                <p className="md:text-xl text-lg font-medium text-gray-800">What is in the course?</p>
                <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                  <li>Lifetime access with freee updates!?</li>
                  <li>Lifetime access with freee updates!?</li>
                  <li>Lifetime access with freee updates!?</li>
                  <li>Lifetime access with freee updates!?</li>
                  <li>Lifetime access with freee updates!?</li>
                </ul>
              </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
