export default {
   "stuff" : [1,2,3],
   "RegistrationForms": initRegistrationForm()
}

function initRegistrationForm(){
   return {
      course_list:[
          {
              course_id: 1,
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
              course_id: 2,
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
              course_id: 3,
              course_title: "Honors Algebra II - Amador",
              dates: "8/21/2018 - 5/22/2019",
              days: "T",
              time: "5:30pm - 7:00pm",
              tuition: "$1,480",
              capacity: 12,
              filled: 3,
              grade: 10
          },
          {
              course_id: 4,
              course_title: "Honors Pre Calculus - Amador",
              dates: "8/21/2018 - 5/22/2019",
              days: "T",
              time: "7:10pm - 8:40pm",
              tuition: "$1,480",
              capacity: 15,
              filled: 2,
              grade: 10,
          },{
              course_id: 5,
              course_title: "Honors Chemistry - DVHS",
              dates: "8/20/2018 - 5/21/2019",
              days: "T",
              time: "8:30pm - 2:00pm",
              tuition: "$450",
              capacity: 8,
              filled: 4,
              grade: 10
          },
          {
              course_id: 6,
              course_title: "Geometry - SRVUSD",
              dates: "8/22/2018 - 5/22/2019",
              days: "W",
              time: "5:30pm - 7:00pm",
              tuition: "$1,440",
              capacity: 12,
              filled: 9,
              grade: 8,
          },{
              course_id: 7,
              course_title: "SAT 2 Math 2",
              dates: "3/8/2019 - 5/8/2019",
              days: "F",
              time: "5:00pm - 8:00pm",
              tuition: "$700",
              capacity: 15,
              filled: 14,
              grade: 10
          },
          {
              course_id: 8,
              course_title: "AP Chemistry",
              dates: "2/23/2019 - 4/27/2019",
              days: "S",
              time: "9:00am - 12:00pm",
              tuition: "$700",
              capacity: 15,
              filled: 8,
              grade: 10,
          },
          {
              course_id: 9,
              course_title: "AP Calc B/C",
              dates: "3/8/2019 - 5/12/2019",
              days: "F",
              time: "5:30pm - 8:30pm",
              tuition: "$700",
              capacity: 15,
              filled: 13,
              grade: 10
          },
          {
              course_id: 10,
              course_title: "AP Calc A/B",
              dates: "3/9/2019 - 5/11/2019",
              days: "S",
              time: "1:00pm - 4:00pm",
              tuition: "$700",
              capacity: 15,
              filled: 2,
              grade: 10,
          },
      ],
      student_list:[],
      teacher_list:[
          {
              id: 1,
              name: "Daniel Huang",
              email: "daniel.huang@gmail.com",
          },
          {
              id: 2,
              name: "Jerry Li",
              email: "jerrylinew@gmail.com",
          },
          {
              id: 3,
              name: "Albert Deng",
              email: "albert@omou.com",
          },
          {
              id: 4,
              name: "Katie Ho",
              email: "katie@omou.com",
          },
      ],
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
              form_type:"student",
              section_titles:["Basic Information", "Parent Information"],
              "Basic Information":[
                  {
                      field: "Name",
                      type: "short text",
                      required: true,
                      full: true,
                  },
                  {
                      field: "Grade",
                      type: "number",
                      required: true,
                      full: false,
                  },
                  {
                      field: "Age",
                      type: "number",
                      required: false,
                      full: false,
                  },
                  {
                      field: "School",
                      type: "short text",
                      required: true,
                      full: true,
                  },
                  {
                      field: "Email",
                      type: "email",
                      required: true,
                      full: true,
                  },
                  {
                      field: "Phone Number",
                      type: "phone number",
                      required: false,
                      full: true,
                  }
              ],
              "Parent Information": [
                  {
                      field: "Name",
                      type: "short text",
                  },
                  {
                      field: "Relationship to Student",
                      type: "short text",
                  },
                  {
                      field: "Email",
                      type: "email",
                  },
                  {
                      field: "Phone Number",
                      type: "phone number",
                  },
                  {
                      field: "Address",
                      type: "address",
                  },
                  {
                      field: "City",
                      type: "short text",
                  },
                  {
                      field: "State",
                      type: "short text",
                      suggestions: [{label:"AL"}, {label:"AK"}, {label:"AZ"}, {label:"AR"}, {label:"CA"}, {label:"CO"},
                          {label:"CT"}, {label:"DE"}, {label:"FL"}, {label:"GA"}, {label:"HI"}, {label:"ID"},
                          {label:"IL"}, {label:"IN"}, {label:"IA"}, {label:"KS"},
                          {label:"KY"}, {label:"KY"}, {label:"LA"}, {label:"ME"}, {label:"MD"}, {label:"MA"}, {label:"MI"},
                          {label:"MS"}, {label:"MO"}, {label:"MT"}, {label:"NE"}, {label:"NV"}, {label:"NH"}, {label:"NJ"},
                          {label:"NM"}, {label:"NY"}, {label:"NC"}, {label:"ND"},
                          {label:"OH"}, {label:"OK"}, {label:"OR"}, {label:"PA"}, {label:"RI"}, {label:"SC"}, {label:"SD"},
                          {label:"TN"}, {label:"TX"}, {label:"UT"}, {label:"VT"}, {label:"VA"}, {label:"WA"}, {label:"WV"},{label:"WI"},
                          {label:"WY"}].map(suggestion => ({
                              value: suggestion.label,
                              label: suggestion.label,
                      }))
                  },
                  {
                      field: "Zip Code",
                      type: "string",
                  },
              ]
          },
          tutoring: {
              form_type: "tutoring",
              section_titles:["Tutoring Session Type", "Student(s)", "Student Information", "Tutor Selection", "Payment"],
              "Tutoring Session Type":[{
                  field: "Select tutoring type",
                  type: "select",
                  conditional: true,
                  options:["Private Tutoring", "Small Group"],
                  required: true,
                  full: false,
              }],
              "Student(s)":{
                  "Private Tutoring": [{
                  field: "Student Name",
                  type: "short text",
                  conditional: false,
                  required: true,
                  full: false,
                  }],
                  "Small Group":[{
                      field: "Student 1 Name",
                      type: "short text",
                      conditional: false,
                      required: true,
                      full: false,
                  },
                      {
                          field: "Student 2 Name",
                          type: "short text",
                          conditional: false,
                          required: true,
                          full: false,
                      },
                      {
                          field: "Student 3 Name",
                          type: "short text",
                          conditional: false,
                          required: false,
                          full: false,
                      },
                  ]
              },
              "Student Information":[
                  {
                      field: "Current Teacher in School",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Textbook Used",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Current Grade in Class",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: false,
                  },
                  {
                      field: "Current Topic in School / Topic of Interest",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Student Strengths",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Student Weaknesses",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
              ],
              "Tutor Selection": [
                  {
                      field: "Teacher",
                      type: "teacher",
                      conditional: false,
                      required: true,
                      full: true,
                  },
                  {
                      field: "Course / Subject",
                      type: "short text",
                      conditional: false,
                      required: true,
                      full: true,
                  },
              ],
              "Payment": [
                  {
                      field: "Amount",
                      type: "short text",
                      conditional: false,
                      required: true,
                      full: true,
                  },
                  {
                      field: "Cash or Check",
                      type: "short text",
                      conditional: false,
                      required: true,
                      full: true,
                  },
              ]
          },
          course: {
              form_type:"course",
              section_titles:["Student","Student Information", "Course Selection", ],
              "Student":[{
                  field: "Student Name",
                  type: "short text",
                  conditional: false,
                  required: true,
                  full: false,
              }],
              "Student Information":[
                  {
                      field: "Current Teacher in School",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Textbook Used",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Current Grade in Class",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: false,
                  },
                  {
                      field: "Current Topic in School / Topic of Interest",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Student Strengths",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
                  {
                      field: "Student Weaknesses",
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
              ],
              "Course Selection":[
                  {
                      field: "Course Title",
                      type: "course",
                      conditional: false,
                      required: false,
                      full: true,
                  },
              ]
          }
      }
   };
}