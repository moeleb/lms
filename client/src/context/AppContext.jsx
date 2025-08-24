import { createContext, useEffect, useState } from "react";

import React from 'react'
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration" ;

export const AppContext = createContext()


export const AppContextProvider = (props) =>{
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate()
    const [allCourses, setAllCourses] = useState([]);
    const [isEducator, setIsEducator] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);



    const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
    }


    // function to calculate the average rating of a course
const calculateRating = (course) => {
    if(course.courseRatings.length ===0){
        return 0;
    } 
    let totalRating= 0;
    course.courseRatings.forEach(rating=>{
        totalRating+= rating.rating
    })
    return totalRating / course.courseRatings.length;
}

    const caluclateChapterTime = (chapter) => {
        let time = 0 ;
         chapter.chapterContent.map((lecture)=>time +=lecture.lectureDuration)
        return humanizeDuration(time* 60 * 1000,{units : ["h","m"]})
    } 
    
    const calculateCourseDuration = (course)=>{
        let time = 0 ;
        course.courseContent.map((chapter)=>chapter.chapterContent.map(
            (lecture) => time += lecture.lectureDuration
        ))
        return humanizeDuration(time* 60 * 1000,{units : ["h","m"]})
    }


    const caluclateNoOfLectures = (course) => {
        let totalLectures = 0;
        course.courseContent.forEach(chapter=> {
            if(Array.isArray(chapter.chapterContent)){
                totalLectures += chapter.chapterContent.length
            }
        })
        return totalLectures ;
    }

    const fetchUserEnrolledCourses =async ()=>{
        setEnrolledCourses(dummyCourses)
    }


    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])

    const  value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator, setIsEducator,
    caluclateChapterTime, calculateCourseDuration , caluclateNoOfLectures,
    enrolledCourses , setEnrolledCourses, fetchUserEnrolledCourses

    }
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}