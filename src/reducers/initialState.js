export default {
    Authentication: {
        token: null,
        email: null,
        accountType: null,
        attemptedLogin: false,
    },
    RegistrationForms: {},
    SignUpForm: {},
    Course: {
        CourseCategories: [],
        NewCourseList: {},
        CourseSessions: {},
    },
    Payments: {},
    Users: {
        StudentList: {},
        ParentList: {},
        ReceptionistList: {
            101: {
                user_id: 101,
                name: 'Ryan Liou',
                phone_number: '1234567899',
                email: 'ryan.liou@gmail.com',
                role: 'receptionist',
                birthday: '11/5/1985',
                action_log: {
                    1: {
                        date: '6/22/2018',
                        time: '2:00PM',
                        description:
                            'Unregistered English 7 sessions with Danny Hong',
                    },
                    2: {
                        date: '6/10/2018',
                        time: '5:00PM',
                        description:
                            'Registered AP Calc tutoring with Daniel Huang',
                    },
                    3: {
                        date: '6/2/2018',
                        time: '5:00PM',
                        description:
                            'Registered AP Calc tutoring with Daniel Huang',
                    },
                    4: {
                        date: '5/24/2018',
                        time: '5:00PM',
                        description:
                            'Registered AP Calc tutoring with Daniel Huang',
                    },
                },
            },
        },
        InstructorList: {},
    },
    CalendarData: {
        CourseSessions: {},
    },
    SearchResults: {
        accountResultsNum: 0,
        accounts: {},
        courseResultsNum: 0,
        courses: {},
    },
    Admin: {
        PriceRules: [],
        Discounts: {
            MultiCourse: [],
            DateRange: [],
            PaymentMethod: [],
        },
    },
    Unpaid: '',
    Cats: {
        catGif: '',
    },
};
