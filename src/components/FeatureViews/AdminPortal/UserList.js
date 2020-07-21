import * as React from "react";
import {
    BooleanField, BooleanInput, Create, Datagrid, DateField, DateInput, Edit,
    List, NumberField, NumberInput, SelectField, SelectInput, Show, SimpleForm,
    SimpleShowLayout, TextField, TextInput,
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
            <TextInput source="description" />
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
