import * as React from "react";
import {
    Datagrid, Edit, List, Show, SimpleForm, SimpleShowLayout, TextField,
    TextInput, Create
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
