describe("Admin Registers an upcoming class", () => {
	before(() => {
		// sessionStorage.setItem("registrations","");
		cy.fixture("course_and_registration.json")
			.then(({
					   course,
					   courses,
					   enrolledCourses,
					   coursesToRegister,
					   studentsAndEnrollments
				   }) => {
				const courseResponse = {"data": {"courses": courses}};
				const parentUserInfo = {
					"__typename": "UserType",
					"email": "pwan007@yahoo.com",
					"firstName": "Paula",
					"lastName": "Wan",
					"id": 2
				};
				const studentUserInfo = {
					"id": 11,
					"first_name": "James",
					"last_name": "Wan",
					"email": "james.wan@gmail.com",
					"__typename": "UserType"
				};
				cy.mockGraphQL({
					"CourseList": {
						"response": courseResponse,
					},
					"GetParents": {
						"response": {
							"data": {
								"accountSearch": {
									"__typename": "AccountSearchResults",
									"results": [
										{
											"__typename": "ParentType",
											"user": parentUserInfo,
											"studentList": ["11", "12"]
										}
									]
								}
							}
						},
						"test": ({query}) => {
							expect(query).to.be.a('string');
						}
					},
					"ParentFetch": {
						"response": {
							"data": {
								"parent": {
									"__typename": "ParentType",
									user: parentUserInfo,
								}
							}
						}
					},
					"GetStudents": {
						"response": {
							"data": studentsAndEnrollments
						}
					},
					"GetCourse": {
						"response": {"data": {"course": course}}
					},
					"StudentFetch": {
						"response": {
							"data": {
								"student": {
									"__typename": "StudentType",
									user: studentUserInfo,
								}
							}
						}
					},
					"GetCoursesToRegister": {
						"response": {
							"data": coursesToRegister
						},
						"test": (variables) => {
							console.log(variables);
						}
					},
					"GetPriceQuote": {
						"response": {
							"data": {
								"priceQuote": {
									subTotal: 100,
									priceAdjustment: 0,
									accountBalance: 0,
									total: 100,
									discounts: [],
									__typename: "PriceQuoteType"
								}
							}
						}
					},
					"GetParentEnrollments": {
						"response": {
							"data": {
								"enrollments": [],
								"__typename": "Query"
							}
						}
					},
					"CreatePayment": {
						"response": {
							"data": {
								id: "1",
								accountBalance: "0",
								createdAt: "10-02-2020T13:00:00",
								discountTotal: "0",
								enrollments: [
									{
										course: {
											"startTime": "15:00:00",
											"endTime": "16:00:00",
											"endDate": "2020-10-16",
											"startDate": "2020-04-30",
											"title": "Honors Biology Prep",
											"instructor": {
												"user": {
													"id": 5,
													"firstName": "Daniel",
													"lastName": "Huang",
													"__typename": "UserType"
												},
												"__typename": "InstructorType"
											},
											"hourlyTuition": 50,
											"courseCategory": {
												"id": 1,
												"name": "Biology",
												"__typename": "CourseCategoryType"
											},
											"id": "1",
											"courseId": "",
											"__typename": "CourseType"
										},
										"student": {
											primaryParent: {
												user: parentUserInfo,
												phoneNumber: "111-123-1234"
											},
											user: studentUserInfo,
											school: {
												name: "Union High School"
											}
										}
									}
								]
							}
						}
					}
				});
				cy.visitAuthenticated('registration');
			});
	});

	it("Loads registration page with courses", () => {
		cy.fixture("course_and_registration.json").then((data) => {
			console.log(data, "this is a test");
			cy.get("[data-cy=registration-heading]")
				.contains("Registration Catalog");
			cy.get("[data-cy=classes-table]")
				.find('tr').should(($tr) => {
				expect($tr).to.have.length.least(1);
			});
		});
	})

	it("Checks if registration actions don't exist without set parent", () => {
		cy.get("[data-cy=quick-register-class]").should('not.exist');
		cy.get("[data-cy=register-class]").should('not.exist');
	});

	it("Sets the parent", () => {
		cy.get("[data-cy=select-parent]").click();
		cy.get("[data-cy=select-parent-input]").fastType("Pau");
		cy.get("[data-cy=parent-option]").first().click();
		cy.get("[data-cy=set-parent-action]").click();
		cy.get("[data-cy=current-parent]").should('exist');
		cy.get("[data-cy=quick-register-class]").should('exist');
		cy.get("[data-cy=register-class]").should('exist');
		cy.get("[data-cy=shopping-cart-num-registrations]").should(($div) => {
			expect($div).contain("0");
		});
	});

	it("Exits the parent", () => {
		cy.get("[data-cy=current-parent]").click();
		cy.get("[data-cy=exit-parent-action]").click();
		cy.get("[data-cy=select-parent]").should(($div) => {
			expect($div).contain("SET PARENT");
		});
		cy.get("[data-cy=current-parent]").should('not.exist');
		cy.get("[data-cy=quick-register-class]").should('not.exist');
		cy.get("[data-cy=register-class]").should('not.exist');
		cy.get("[data-cy=select-parent]").click();
		cy.get("[data-cy=select-parent-input]").fastType("Pau");
		cy.get("[data-cy=parent-option]").first().click();
		cy.get("[data-cy=set-parent-action]").click();
	});

	it("Quick registers a class", () => {
		cy.get("[data-cy=quick-register-class]").first().click();
		cy.get("[data-cy=select-student-to-register]").click();
		cy.get("[data-cy=student-value]").first().click();
		cy.get("[data-cy=add-registration-to-cart]").click();
		cy.get("[data-cy=shopping-cart-num-registrations]").should(($div) => {
			expect($div).contain("1");
		});
	});

	it("Registers a class through the form", () => {
		cy.get("[data-cy=register-class]").click();
		cy.get("[data-cy=student-student-select]").click();
		cy.get("[data-value=11]").click();
		cy.get("[data-cy=student-nextButton]").click();
		cy.get("[data-cy=student_info-nextButton]").click();
		cy.get("[data-cy=course-class]").click();
		cy.get('[data-cy="course.class-2"]').click();
		cy.get("[data-cy=submitButton]").click();
		cy.waitFor("[data-cy=student-card]");
		cy.waitFor("[data-cy=back-to-register]");
		cy.get("[data-cy=back-to-register]").click();
		cy.get("[data-cy=shopping-cart-num-registrations]").should(($div) => {
			expect($div).contain("2");
		});
	});

	it("Does not register a class twice for the same student through the form", () => {
		cy.get("[data-cy=register-class]").click();
		cy.get("[data-cy=student-student-select]").click();
		cy.get("[data-value=11]").click();
		cy.get("[data-cy=student-nextButton]").click();
		cy.get("[data-cy=student_info-nextButton]").click();
		cy.get("[data-cy=course-class]").click();
		cy.get('[data-cy="course.class-1"]').click();
		cy.get("[data-cy=submitButton]").click();
		cy.waitFor("[data-cy=student-card]");
		cy.waitFor("[data-cy=back-to-register]");
		cy.get("[data-cy=back-to-register]").click();
		cy.get("[data-cy=shopping-cart-num-registrations]").should(($div) => {
			expect($div).contain("2");
		});
	});

	it("Loads registration cart", () => {
		cy.fixture("course_and_registration.json")
			.then((data) => {
				cy.get("[data-cy=registration-cart]").click();
				cy.waitFor("[data-cy=payment-title]");
				cy.get("[data-cy=payment-title]").should('exist');
			});
	});

	it("Validates number of sessions entered", () => {
		cy.get("[data-cy=0-session-input]").fastType("28");
		cy.get("[data-cy=0-session-input]").children('.Mui-error').should('exist');
		cy.get("[data-cy=0-session-input-inner]").clear();
	});

	it("Checks out registration cart", () => {
		cy.get("[data-cy=0-session-input]").fastType("25");
		cy.get("[data-cy=1-session-input]").fastType("5");
		cy.get("[data-cy=Cash-checkbox]").click();
		cy.get("[data-cy=pay-action]").click();
		cy.waitFor("[data-cy=payment-header]");
		cy.get("[data-cy=payment-header]").should('exist');
		cy.get("[data-cy=close-parent]").click();
		cy.waitFor("[data-cy=select-parent]");
		cy.get("[data-cy=select-parent]").should('exist');
	});

	it("Cannot enroll the same student to the same course twice", () => {
		cy.get("[data-cy=select-parent]").click();
		cy.get("[data-cy=select-parent-input]").fastType("Kel");
		cy.get("[data-cy=parent-option]").first().click();
		cy.get("[data-cy=set-parent-action]").click();
		cy.get("[data-cy=register-class]").click();
		cy.get("[data-cy=student-student-select]").click();
		cy.get("[data-value=3]").click();
		cy.get("[data-cy=student-nextButton]").click();
		cy.get("[data-cy=student_info-nextButton]").click();
		cy.get("[data-cy=course-class]").click();
		cy.get('[data-cy="course.class-1"]').click();
		cy.get("[data-cy=submitButton]").click();
		cy.waitFor("[data-cy=student-card]");
		cy.waitFor("[data-cy=back-to-register]");
		cy.get("[data-cy=register-to-checkout]").click();
		cy.waitFor("[data-cy=payment-title");
		cy.get("[data-cy=0-session-input]").fastType("25");
		cy.get("[data-cy=Cash-checkbox]").click();
		cy.get("[data-cy=pay-action]").click();
		cy.get("[data-cy=payment-header]").should('exist');
		cy.get("[data-cy=close-parent]").click();
		cy.get("[data-cy=num-enrolled-students]").should('contain', 1);
	});

	it("New Enrollment in Course Registration Page", () => {
		cy.get("[data-cy=course-1]").click();
		cy.get("[data-cy=enrollment-list]").find('tr').should('have.length', 1);
	});
})