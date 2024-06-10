'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

function useIsFirstRender() {
    const isFirstRender = react.useRef(true);
    react.useEffect(() => {
        isFirstRender.current = false;
    }, []);
    return isFirstRender.current;
}

exports.useIsFirstRender = useIsFirstRender;
