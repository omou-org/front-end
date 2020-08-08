import * as React from "react";
import {
  BooleanField, BooleanInput, Create, Datagrid, DateField, DateInput, Edit,
  List, NumberField, NumberInput, SelectField, SelectInput, Show, SimpleForm,
  SimpleShowLayout, TextField, TextInput, ReferenceInput, SaveButton, TopToolbar, useRefresh, useRedirect, useNotify, Button, ShowButton
} from "react-admin";
import dataProvider from "./dataProvider";


const CustomSaveButton = (data) => {
  const refresh = useRefresh();
  const redirect = useRedirect();
  const notify = useNotify();


  const approve = () => {
    console.log(data)
    return dataProvider
      .create('courseCategories',

        { data: { name: data.name, description: data.description } })
      .then(response => {
        redirect('list');
        refresh();
        notify('Categories Saved', 'info')
      })
  }
  return (
    <TopToolbar>
      <SaveButton submitOnEnter={true} />
      <SaveButton
        label="post.action.save_and_notify"
        onClick={approve}
        submitOnEnter={true}
        redirect="list"
        resource={'courseCategories'}
      />
      {/* <ShowButton />
      <Button basePath={data.basePath} record={data} label="MY CUSTOM BUTTON" onClick={approve} /> */}
    </TopToolbar>

  )
}



export const CategoryList = (props) => {


  return (
    <List {...props}>
      <Datagrid rowClick="edit">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="description" />
      </Datagrid>
    </List>
  )
}

export const CategoryCreate = (props) => {
  return (
    <Create  {...props}>
      <SimpleForm redirect='list'>
        <TextInput source="name" />
        <TextInput source="description" />
        <CustomSaveButton />
      </SimpleForm>
    </Create>
  )
}

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

// Schools
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
    <SimpleForm redirect="list">
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
      <TextInput source="name" />
      <TextInput source="zipcode" />
      <TextInput source="district" />
    </SimpleForm>
  </Edit>
);

const amountTypeChoices = [
  {
    "id": "PERCENT",
    "name": "Percent",
  },
  {
    "id": "FIXED",
    "name": "Fixed",
  },
];

const discountShowFields = [
  <TextField key="id" source="id" />,
  <TextField key="name" source="name" />,
  <TextField key="description" source="description" />,
  <NumberField key="amount" source="amount" />,
  <SelectField choices={amountTypeChoices} key="amountType"
    source="amountType" />,
  <BooleanField key="active" source="active" />,
];

const discountEditFields = [
  <TextInput key="name" source="name" />,
  <TextInput key="description" source="description" />,
  <NumberInput key="amount" source="amount" />,
  <SelectInput choices={amountTypeChoices} key="amountType"
    source="amountType" />,
  <BooleanInput key="active" source="active" />,
];

const discountDisplays = (fields) => [
  (props) => (
    <List {...props}>
      <Datagrid rowClick="edit">
        {discountShowFields}
        {fields}
      </Datagrid>
    </List>
  ),
  (props) => (
    <Show {...props}>
      <SimpleShowLayout>
        {discountShowFields}
        {fields}
      </SimpleShowLayout>
    </Show>
  ),
];

const discountModifiers = (fields) => [
  (props) => (
    <Create {...props}>
      <SimpleForm>
        {discountEditFields}
        {fields}
      </SimpleForm>
    </Create>
  ),
  (props) => (
    <Edit {...props}>
      <SimpleForm>
        {discountEditFields}
        {fields}
      </SimpleForm>
    </Edit>
  ),
];


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
      <SelectField source="courseType" choices={courseTypes} />
      <TextField source="category.name" label="Course category" />
    </Datagrid>
  </List>
);


export const TuitionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />

      <TextField source="academicLevel" />
      <SelectField source="courseType" choices={courseTypes} />
      <TextField source="category.name" label="Course category" />
    </SimpleShowLayout>
  </Show>
);



export const TuitionEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>

      <SelectInput source="academicLevel" choices={academicLevelChoices} />
      <ReferenceInput
        label="Course category"
        // source="category.id" => prepopulates field but error on submit
        source="category"
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
      <SelectInput source="academicLevel" choices={academicLevelChoices} />
      <ReferenceInput
        label="Course category"
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



export const [BulkDiscountList, BulkDiscountShow] =
  discountDisplays(<NumberField source="numSessions" />);

export const [BulkDiscountCreate, BulkDiscountEdit] =
  discountModifiers(<NumberInput source="numSessions" />);


export const [DateRangeDiscountList, DateRangeDiscountShow] =
  discountDisplays([
    <DateField key="startDate" source="startDate" />,
    <DateField key="endDate" source="endDate" />,
  ]);

export const [DateRangeDiscountCreate, DateRangeDiscountEdit] =
  discountModifiers([
    <DateInput key="startDate" source="startDate" />,
    <DateInput key="endDate" source="endDate" />,
  ]);

export const [PaymentMethodDiscountList, PaymentMethodDiscountShow] =
  discountDisplays(<TextField source="paymentMethod" />);

export const [PaymentMethodDiscountCreate, PaymentMethodDiscountEdit] =
  discountModifiers(<TextInput source="paymentMethod" />);