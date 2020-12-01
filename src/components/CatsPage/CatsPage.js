import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";

import "./catsPage.scss";
import * as catActions from "actions/catActions";
import Loading from "components/OmouComponents/Loading";

const getWindowSize = () => [window.innerWidth, window.innerHeight];

const CatsPage = () => {
    const dispatch = useDispatch();
    const auth = useSelector((store) => store.auth);
    const api = useMemo(() =>
        bindActionCreators(catActions, dispatch), [dispatch]);
    const apiImage = useSelector(({ Cat }) => Cat.catGif);

    useEffect(() => {
        api.fetchCats("cats");
    }, [api]);

    const [[windowWidth, windowHeight], setSize] = useState(getWindowSize());

    const handleResize = useCallback(() => {
        setSize(getWindowSize());
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [handleResize]);

    const imgWidth = useMemo(() =>
        Number(apiImage.width || 0), [apiImage.width]);
    const imgHeight = useMemo(() =>
        Number(apiImage.height || 0), [apiImage.height]);

    const [{ x, y }, setPosition] = useState({
        "x": Math.floor(Math.random() * (windowWidth - imgWidth)),
        "xm": Math.random() > 0.5 ? 1.5 : -1.5,
        "y": Math.floor(Math.random() * (windowHeight - imgWidth)),
        "ym": Math.random() > 0.5 ? 1.5 : -1.5,
    });
    // top and left of the main area to bounce in, in pixels
    const LEFT = 225,
        TOP = 75;

    const animate = useCallback(() => {
        setPosition((oldPos) => {
            const isCrashingLeft = oldPos.x <= LEFT && oldPos.xm < 0;
            const isCrashingRight =
                oldPos.x + imgWidth >= windowWidth && oldPos.xm > 0;
            const isCrashingTop = oldPos.y <= TOP && oldPos.ym < 0;
            const isCrashingBottom =
                oldPos.y + imgHeight >= windowHeight && oldPos.ym > 0;
            const newPos = { ...oldPos };
            if (isCrashingLeft || isCrashingRight) {
                newPos.xm *= -1;
                api.fetchCats("cats");
            }
            if (isCrashingTop || isCrashingBottom) {
                newPos.ym *= -1;
                api.fetchCats("cats");
            }
            newPos.x = Math.min(
                Math.max(oldPos.x + newPos.xm, LEFT),
                windowWidth - imgWidth
            );
            newPos.y = Math.min(
                Math.max(oldPos.y + newPos.ym, TOP),
                windowHeight - imgHeight
            );
            return newPos;
        });
    }, [windowWidth, windowHeight, imgWidth, imgHeight, api]);

    useEffect(() => {
        const intervalId = setInterval(animate, 1000 / 60);
        return () => clearInterval(intervalId);
    }, [animate]);

    if (auth.first_name !== "Nelson" || auth.last_name !== "Ng") {
        return <h1>Only Nelson is permitted to view this sanctuary</h1>;
    }

    if (!apiImage) {
        return <Loading />;
    }

    return (
        <div
            className="screensaver">
            <section
                className="screensaver__bouncer"
                style={{
                    "backgroundColor": "white",
                    "height": `${apiImage.height}px`,
                    "transform": `translate(${x}px, ${y}px)`,
                    "width": `${apiImage.width}px`,
                }}>
                <img src={apiImage.url} alt="Random Cat Gifs"/>
            </section>
        </div>
    );
};

export default CatsPage;
