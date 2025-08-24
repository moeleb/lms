import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import humanizeDuration from 'humanize-duration';
import YouTube from 'react-youtube';
import Footer from '../../components/student/Footer';
import Rating from '../../components/student/Rating';

const Player = () => {
  const { enrolledCourses, caluclateChapterTime } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});
  const [playerData, setPlayerData] = useState(null);

  const getCourseData = () => {
    enrolledCourses.forEach((course) => {
      if (course._id === courseId) {
        setCourseData(course);
      }
    });
  };

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    getCourseData();
  }, [enrolledCourses]);

  return (
    <>
      <div className="p-4 sm:p-10 flex flex-col md:flex-row gap-10 md:px-36">
        {/* Left: Course Content */}
        <div className="flex-1 text-gray-800">
          <h2 className="text-xl font-semibold">Course Structure</h2>
          <div className="pt-5">
            {courseData &&
              courseData.courseContent.map((chapter, index) => (
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
                          openSection[index] ? 'rotate-180' : ''
                        }`}
                      />
                      <p className="font-medium md:text-base text-sm">
                        {chapter.chapterTitle}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {chapter.chapterContent.length} lectures •{' '}
                      {caluclateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Accordion Body */}
                  <div
                    className="overflow-hidden transition-all duration-500"
                    style={{
                      maxHeight: openSection[index] ? '1000px' : '0px',
                    }}
                  >
                    <ul className="list-disc md:pl-10 pl-5 pr-4 py-2 text-gray-600 border-t border-gray-200">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li className="flex items-start gap-2 py-1" key={i}>
                          <img
                            className="w-4 h-4 mt-1"
                            src={false ? assets.blue_tick_icon : assets.play_icon}
                            alt="lecture"
                          />
                          <div className="flex items-center justify-between text-gray-800 w-full text-xs md:text-base">
                            <p>{lecture.lectureTitle}</p>
                            <div className="flex gap-3">
                              {lecture.lectureUrl && (
                                <p
                                  onClick={() =>
                                    setPlayerData({
                                      ...lecture,
                                      chapter: index + 1,
                                      lecture: i + 1,
                                    })
                                  }
                                  className="text-blue-500 cursor-pointer"
                                >
                                  Watch
                                </p>
                              )}
                              <p>
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  {
                                    units: ['h', 'm'],
                                  }
                                )}
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
          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this course:</h1>
            <Rating initialRating={0} />
          </div>
        </div>

        {/* Right: Video Player */}
        <div className="flex-1">
          {playerData ? (
            <div>
              <YouTube
                videoId={playerData.lectureUrl.split('/').pop()}
                className="w-full aspect-video"
              />
              <div className="mt-4 flex items-center justify-between">
                <p className="font-medium">
                  {playerData.chapter}.{playerData.lecture}{' '}
                  {playerData.lectureTitle}
                </p>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                  {false  ? 'Completed' : 'Mark Complete'}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : ' '}
              alt=""
              className="w-full rounded-md"
            />
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Player;
