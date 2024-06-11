import { RenderHookOptions, RenderHookResult } from '@testing-library/react';
import { act } from '@testing-library/react';
declare function customRenderHook<Result, Props>(callback: (props: Props) => Result, options?: RenderHookOptions<Props>): RenderHookResult<Result, Props>;
export { customRenderHook, act };
