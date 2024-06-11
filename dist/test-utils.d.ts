import { act } from '@testing-library/react';
declare function customRenderHook<Result, Props>(hook: (props: Props) => Result, initialProps?: Props): {
    result: {
        current: Result;
    };
    rerender: (props?: Props) => void;
    unmount: () => void;
};
export { customRenderHook, act };
