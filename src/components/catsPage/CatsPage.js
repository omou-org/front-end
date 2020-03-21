import React, { useMemo, useEffect, useState, useRef, useCallback } from "react";
import { withRouter } from "react-router-dom";
import * as catActions from "../../actions/catActions"
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import "./catsPage.scss"
import Loading from "components/Loading";

const CatsPage = () => {
    const dispatch = useDispatch();
    const auth = useSelector((store) => store.auth)
    const api = useMemo(() => bindActionCreators(catActions, dispatch), [dispatch])
    const list = useSelector((store) => store.Cat)

    useEffect(() => {
        api.fetchCats("cats")
    }, [api]);

    const apiImage = list.catGif;
    const COLORS = ["red", "green", "blue", "indigo", "violet"];

    const useBoundingClientRect = () => {
        const ref = useRef(null);
        const rect = useMemo(
            () =>
                ref.current
                    ? ref.current.getBoundingClientRect()
                    : { width: 0, height: 0 },
            [ref.current]
        );
        return [ref, rect];
    };

    const useRainbow = initialColor => {
        const [colorIndex, setColorIndex] = useState(COLORS.indexOf(initialColor));
        const next = useCallback(
            () => setColorIndex(idx => (idx + 1) % COLORS.length),
            [setColorIndex]
        );
        return [COLORS[colorIndex], next];
    };

    const useViewport = () => {
        const getSize = useCallback(
            () => ({ width: window.innerWidth, height: window.innerHeight }),
            []
        );
        const [{ width, height }, setSize] = useState(getSize());
        useEffect(() => {
            const handleResize = () => {
                setSize(getSize());
            };
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, []);
        return [width, height];
    };

    const useColoredBouncer = startColor => {
        const [color, nextColor] = useRainbow(startColor);
        const [vw, vh] = useViewport();
        const [ref, { width, height }] = useBoundingClientRect();
        const [{ x, y }, setPosition] = useState({
            x: Math.floor(Math.random() * (vw - width)),
            xm: Math.random() > 0.5 ? 1.5 : -1.5,
            y: Math.floor(Math.random() * (vh - width)),
            ym: Math.random() > 0.5 ? 1.5 : -1.5
        });
        useEffect(
            () => {
                const animate = () => {
                    setPosition(p => {
                        const isCrashingLeft = p.x <= 223 && p.xm < 0;
                        const isCrashingRight = p.x + width >= vw && p.xm > 0;
                        const isCrashingTop = p.y <= 64 && p.ym < 0;
                        const isCrashingBottom = p.y + height >= vh && p.ym > 0;
                        const np = { ...p };
                        if (isCrashingLeft || isCrashingRight) {
                            np.xm *= -1;
                            nextColor();
                            api.fetchCats("cats")

                        }
                        if (isCrashingTop || isCrashingBottom) {
                            np.ym *= -1;
                            nextColor();
                            api.fetchCats("cats")
                        }
                        np.x = Math.min(Math.max(p.x + np.xm, 0), vw - width);
                        np.y = Math.min(Math.max(p.y + np.ym, 0), vh - height);
                        return np;
                    });
                };
                const intervalId = setInterval(animate, 1000 / 60);
                return () => clearInterval(intervalId);
            },
            [vw, vh, width, height]
        );
        return [ref, x, y, color];
    };
    const [ref, x, y,] = useColoredBouncer("red");
    if (auth.first_name !== "Nelson" && auth.last_name !== "Ng") {
        return (<h1>Only Nelson is permitted to view this sanctuary</h1>);
    }
    if (!apiImage.width || !apiImage.height) {

        return <Loading />
    }
    return (<div className="screensaver">
        <section
            ref={ref}
            className="screensaver__bouncer"
            style={{
                width: `${apiImage.width}px`,
                height: `${apiImage.height}px`,
                backgroundColor: "white",
                transform: `translate(${x}px, ${y}px)`
            }}
        >
            <img
                src={apiImage.url}
            >

            </img>
        </section></div>);


}

export default withRouter(CatsPage);
