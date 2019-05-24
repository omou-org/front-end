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
          },
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
          },{
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
          },{
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
          },
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
          },
      ],
      student_list:[],
      categories:[
          {
              id: 1,
              cat_title: "AP Courses",
          },
          {
              id:2,
              cat_title: "Subjects",
          },
          {
              id:3,
              cat_title: "Middle School"
          },
          {
              id: 4,
              cat_title: "DVHS",
          },
          {
              id:5,
              cat_title: "AVHS",
          },
          {
              id:6,
              cat_title: "Test Preparation"
          },
          {
              id: 7,
              cat_title: "SAT",
          },
          {
              id:8,
              cat_title: "SAT Subject Tests",
          },
          {
              id:9,
              cat_title: "BYU Online"
          },
      ],
      registration_form:{
          student: {
              section_titles:["Basic Information", "Parent Information"],
              0:[
                  {
                      field: "Name",
                      type: "string",
                      required: true,
                      full: true,
                  },
                  {
                      field: "Grade",
                      type: "int",
                      required: true,
                      full: false,
                  },
                  {
                      field: "Age",
                      type: "int",
                      required: false,
                      full: false,
                  },
                  {
                      field: "School",
                      type: "string",
                      required: true,
                      full: true,
                  },
                  {
                      field: "Email",
                      type: "string",
                      required: true,
                      full: true,
                  },
                  {
                      field: "Phone Number",
                      type: "string",
                      required: false,
                      full: true,
                  }
              ],
              1: [
                  {
                      field: "Name",
                      type: "string",
                  },
                  {
                      field: "Relationship to Student",
                      type: "string",
                  },
                  {
                      field: "Email",
                      type: "int",
                  },
                  {
                      field: "Phone Number",
                      type: "string",
                  },
                  {
                      field: "Address",
                      type: "string",
                  },
                  {
                      field: "City",
                      type: "string",
                  },
                  {
                      field: "State",
                      type: "string",
                  },
                  {
                      field: "Zip Code",
                      type: "string",
                  },
              ]
          }
      }
   };
}