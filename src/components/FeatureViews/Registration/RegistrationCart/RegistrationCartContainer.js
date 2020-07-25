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
import PaymentBoard from "./PaymentBoard";
import RegistrationActions from "../RegistrationActions";

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
			academicLevel
			courseCategory {
				id
				name
			  }
			instructor {
				user {
				  id
				  firstName
				  lastName
				}
			  }
		}
	}
`;

export default function RegistrationCartContainer() {
	const { currentParent, ...registrationCartState } = getRegistrationCart();
	const [registrationCart, setRegistrationCart] = useState({});
	// create list of students to fetch
	const studentIds = Object.keys(registrationCartState);
	// create list of courses to fetch
	const courseIds = [].concat.apply([], Object.values(registrationCartState))
		.map(({ course }) => course.id);
	const { data, loading } = useQuery(GET_STUDENT_INFOS, { variables: { userIds: studentIds } });
	const coursesResponse = useQuery(GET_COURSES_TO_REGISTER, { variables: { courseIds: courseIds } });

	useEffect(() => {
		if (!coursesResponse.loading) {
			const courseData = coursesResponse.data.courses;
			setRegistrationCart(() => {
				let registrationCart = {};
				studentIds.forEach(studentId => {
					registrationCart[studentId] = registrationCartState[studentId].map(registration => ({
						...registration,
						course: courseData.find(course => course.id === registration.course.id),
						checked: false,
					}));
				});
				return registrationCart;
			});
		}
	}, [coursesResponse?.loading, setRegistrationCart]);

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

	if (loading || coursesResponse.loading) return <Loading small />;

	const studentData = data.userInfos;

	return (<RegistrationContext.Provider value={{ registrationCart, currentParent, updateSession }}>
			<BackgroundPaper>
				<Grid container>
					<RegistrationActions/>
				</Grid>
				<hr/>
				<Typography variant="h2" align="left">Registration Cart</Typography>
				<Typography
					style={{fontSize: "2em"}}
					align="left"
					gutterBottom
				>
					Pay for Course(s)
				</Typography>
				<Grid container item>
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
				<Grid container item justify="space-between" style={{ marginTop: "50px" }}>
					<PaymentBoard />
				</Grid>
			</Grid>
		</BackgroundPaper>
	</RegistrationContext.Provider>
	)
}