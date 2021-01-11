import {DELETE, GET, PATCH, POST} from "actions/actionTypes";

export default {
	Authentication: {
		"token": null,
		"email": null,
		"accountType": null,
		attemptedLogin: false,
	},
	RegistrationForms: {},
	SignUpForm: initSignUpForm(),
	Course: {
		CourseCategories: [],
		NewCourseList: {},
		CourseSessions: {},
	},
	Enrollments: {},
	Payments: {},
	Users: {
		StudentList: {},
		ParentList: {},
		ReceptionistList: {
			101: {
				user_id: 101,
				name: "Ryan Liou",
				phone_number: "1234567899",
				email: "ryan.liou@gmail.com",
				role: "receptionist",
				birthday: "11/5/1985",
				action_log: {
					1: {
						date: "6/22/2018",
						time: "2:00PM",
						description: "Unregistered English 7 sessions with Danny Hong",
					},
					2: {
						date: "6/10/2018",
						time: "5:00PM",
						description: "Registered AP Calc tutoring with Daniel Huang",
					},
					3: {
						date: "6/2/2018",
						time: "5:00PM",
						description: "Registered AP Calc tutoring with Daniel Huang",
					},
					4: {
						date: "5/24/2018",
						time: "5:00PM",
						description: "Registered AP Calc tutoring with Daniel Huang",
					},
				},
			},
		},
		InstructorList: {},
	},
	CalendarData: {
		CourseSessions: {},
	},
	RequestStatus: initRequests(),
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
	Unpaid: "",
	Cats: {
		catGif: "",
	},
};

function initRequests() {
	return {
		admin: {
			[GET]: {},
			[PATCH]: {},
		},
		course: {
			[GET]: {},
			[PATCH]: {},
		},
		category: {
			[GET]: "",
			[PATCH]: {},
			[POST]: "",
		},
		instructor: {
			[GET]: {},
			[PATCH]: {},
		},
		parent: {
			[GET]: {},
			[PATCH]: {},
		},
		student: {
			[GET]: {},
			[PATCH]: {},
		},
		schedule: {
			[GET]: {},
			[PATCH]: {},
		},
		enrollment: {
			[GET]: {},
			[PATCH]: {},
		},
		accountNote: {
			[GET]: {},
			[PATCH]: {},
		},
		courseNote: {
			[GET]: {},
			[PATCH]: {},
		},
		enrollmentNote: {
			[GET]: {},
			[PATCH]: {},
		},
		priceRule: {
			[GET]: {},
			[PATCH]: {},
			[POST]: {},
		},
		discount: {
			dateRange: {
				[GET]: {},
				[POST]: {},
			},
			multiCourse: {
				[GET]: {},
				[PATCH]: {},
				[POST]: {},
			},
			paymentMethod: {
				[GET]: {},
				[POST]: {},
			},
			[DELETE]: "",
			[PATCH]: "",
		},
		registration: {
			enrollment: {
				[POST]: {},
			},
		},
		registeringParent: "",
		payment: {
			[GET]: {},
		},
	};
}

function initSignUpForm() {
	return {};
}
