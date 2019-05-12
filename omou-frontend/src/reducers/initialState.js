export default {
   "stuff" : [1,2,3],
   "RegistrationForms": initRegistrationForm()
}

function initRegistrationForm(){
   return {
      course_list:[
          {
              id: 1,
              course_title: "6th Grade Math Placement Test Prep",
              dates: "6/22/2018 - 8/17/2019",
              days: "T",
              time: "8:30pm - 2:00pm",
              tuition: "$450",
              capacity: 20,
              filled: 14,
              grade: 5
          },
          {
              id: 2,
              course_title: "8th Grade Science",
              dates: "6/22/2018 - 8/17/2019",
              days: "W",
              time: "6:30pm - 8:00pm",
              tuition: "$500",
              capacity: 15,
              filled: 2,
              grade: 8,
          }
      ],
      student_list:[],
      registration_form:[]
   };
}