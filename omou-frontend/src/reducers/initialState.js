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
                      type: "short text",
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
                      type: "short text",
                      conditional: false,
                      required: false,
                      full: true,
                  },
              ]
          }
      }
   };
}