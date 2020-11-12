import React from "react";
import {Route, Switch} from "react-router-dom";

import BadgeDemo from "../../theme/ThemedComponents/Badge/BadgeDemo";
import TypographyDemo from "../../theme/ThemedComponents/Typography/TypographyDemo"
import ButtonDemo from '../../theme/ThemedComponents/Button/ButtonDemo';
import ColorsDemo from '../../theme/ThemedComponents/Colors/ColorsDemo';
import ListComponentDemo from '../OmouComponents/ListComponent/ListComponentDemo';

const DemoRoutes = () => (
    <Switch>
        <Route path="/demo/badge">
            <BadgeDemo/>
        </Route>
        <Route path="/demo/typography">
            <TypographyDemo/>
        </Route>
        <Route path="/demo/button">
            <ButtonDemo/>
        </Route>
        <Route path="/demo/color">
            <ColorsDemo/>
        </Route>
        <Route path="/demo/listcomponent">
            <ListComponentDemo />
        </Route>
    </Switch>
);

export default DemoRoutes;