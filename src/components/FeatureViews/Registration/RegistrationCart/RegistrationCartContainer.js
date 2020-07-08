import React, {useEffect, useState} from "react";
import {getRegistrationCart} from "../../../OmouComponents/RegistrationUtils";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";
import Loading from "../../../OmouComponents/Loading";
import BackgroundPaper from "../../../OmouComponents/BackgroundPaper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {RegistrationContext} from "./RegistrationContext";
import StudentRegistrationEntry from "./StudentRegistrationsEntry";

const GET_STUDENT_INFOS = gql`
	query GetStudentInfos($userIds: [ID]!) {
		userInfos(userIds: $userIds) {
        ... on StudentType {
          user {
            firstName
            lastName
            email
            id
          }
        }
      }
	}
`;

const GET_COURSES_TO_REGISTER = gql`
	query GetCoursesToRegister($courseIds: [ID]!) {
		courses(courseIds: $courseIds){
			id
			title
			startDate
			endDate
			hourlyTuition
			startTime
			endTime
		}
	}
`;

export default function RegistrationCartContainer() {
	const {currentParent, ...registrationCartState} = getRegistrationCart();
	const [registrationCart, setRegistrationCart] = useState({});
	// create list of students to fetch
	const studentIds = Object.keys(registrationCartState);
	// create list of courses to fetch
	const courseIds = [].concat.apply([], Object.values(registrationCartState))
		.map(({course}) => course.existing_id);
	const {data, loading} = useQuery(GET_STUDENT_INFOS, {variables: {userIds: studentIds}});
	const coursesResponse = useQuery(GET_COURSES_TO_REGISTER, {variables: {courseIds: courseIds}});

	useEffect(() => {
		if (coursesResponse?.data?.courses) {
			const courseData = coursesResponse.data.courses;
			setRegistrationCart(() => {
				let registrationCart = {};
				studentIds.forEach(studentId => {
					registrationCart[studentId] = registrationCartState[studentId].map(registration => ({
						course: courseData.find(course => course.id === registration.course.existing_id),
						numSessions: registration.numSessions,
						checked: false,
					}));
				});
				return registrationCart;
			});
		}
	}, [setRegistrationCart, data, coursesResponse]);

	const updateSession = (newSessionNum, checked, studentId, courseId) => {
		setRegistrationCart((prevRegistrationCart) => {
			const registrationToEditIndex = prevRegistrationCart[studentId]
				.map(registration => Number(registration.course.id))
				.indexOf(Number(courseId));

			let updatedRegistrationList = prevRegistrationCart[studentId];

			updatedRegistrationList[registrationToEditIndex] = {
				...updatedRegistrationList[registrationToEditIndex],
				numSessions: newSessionNum,
				checked,
			};

			return {
				[studentId]: updatedRegistrationList,
				...prevRegistrationCart,
			}
		});
	};

	if (loading || coursesResponse.loading) return <Loading small/>;

	const studentData = data.userInfos;

	return (<RegistrationContext.Provider value={{registrationCart, updateSession}}>
			<BackgroundPaper>
				<Typography variant="h2" align="left">Registration Cart</Typography>
				<Typography
					style={{fontSize: "2em"}}
					align="left"
					gutterBottom
				>
					Pay for Course(s)
				</Typography>
				<Grid container direction="row" spacing={5}>
					{
						Object.entries(registrationCart).map(([studentId, registration]) =>
							<StudentRegistrationEntry
								key={studentId}
								student={studentData.find(student => student.user.id === studentId)}
								registrationList={registration}
							/>)
					}
				</Grid>
			</BackgroundPaper>
		</RegistrationContext.Provider>
	)
}