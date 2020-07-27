/* eslint-disable indent */
import * as React from "react";
import {
  Datagrid,
  Edit,
  List,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput,
  Create,
  SelectField,
  SelectInput,
  ReferenceInput,
} from "react-admin";

export const CategoryList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
    </Datagrid>
  </List>
);

export const CategoryCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description"></TextInput>
    </SimpleForm>
  </Create>
);

export const CategoryEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
    </SimpleForm>
  </Edit>
);

export const CategoryShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="description" />
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);

//Schools
export const SchoolList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="zipcode" />
      <TextField source="district" />
    </Datagrid>
  </List>
);

export const SchoolCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="zipcode" />
      <TextInput source="district" />
    </SimpleForm>
  </Create>
);

export const SchoolShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="zipcode" />
      <TextField source="district" />
    </SimpleShowLayout>
  </Show>
);

export const SchoolEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextField source="name" />
      <TextField source="zipcode" />
      <TextField source="district" />
    </SimpleForm>
  </Edit>
);

const academicLevelChoices = [
  { id: "ELEMENTARY_LVL", name: "Elementary School" },
  { id: "MIDDLE_LVL", name: "Middle School" },
  { id: "HIGH_LVL", name: "High School" },
  { id: "COLLEGE_LVL", name: "College" },
];
const courseTypes = [
  { id: "CLASS", name: "Class" },
  { id: "TUTORING", name: "Tutoring" },
  { id: "SMALL_GROUP", name: "Small Group" },
];

export const TuitionList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <SelectField source="academicLevel" choices={academicLevelChoices} />
      <TextField source="name" />
      <SelectField source="courseType" choices={courseTypes} />
      <TextField source="category.name" label="Category"/>
    </Datagrid>
  </List>
);

export const TuitionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="academicLevel" />
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);

export const TuitionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <SelectInput source="academicLevel" choices={academicLevelChoices} />
      <ReferenceInput
        label="Course Category"
        // source="category"
        source="category.id"
        reference="courseCategories"
        >
            <SelectInput 
              optionText={(record) => record.name} 
              />
        </ReferenceInput>
        <TextInput source="hourlyTuition" />
        <SelectInput source="courseType" choices={courseTypes} />
    </SimpleForm>
  </Edit>
);

export const TuitionCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <SelectInput source="academicLevel" choices={academicLevelChoices} />
      <ReferenceInput
        label="Course Category"
        source="category"
        reference="courseCategories"
      >
        <SelectInput optionText={(record) => record.name} />
      </ReferenceInput>
      <TextInput source="hourlyTuition" />
      <SelectInput source="courseType" choices={courseTypes} />
    </SimpleForm>
  </Create>
);
