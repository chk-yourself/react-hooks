import { act } from '@testing-library/react';
import { ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

interface WrapperProps {
  children?: ReactNode;
}

function customRenderHook<Result, Props>(
  hook: (props: Props) => Result,
  initialProps?: Props,
): {
  result: { current: Result };
  rerender: (props?: Props) => void;
  unmount: () => void;
} {
  const container = document.createElement('div');
  const root = createRoot(container);

  const Wrapper: React.FC<WrapperProps> = ({ children }) => {
    return <>{children}</>;
  };

  const result: { current: Result } = { current: hook(initialProps as Props) };

  const render = (props: Props | undefined) => {
    act(() => {
      root.render(
        <Wrapper>
          <TestComponent hook={hook} props={props} result={result} />
        </Wrapper>,
      );
    });
  };

  const rerender = (props?: Props) => render(props || initialProps);
  const unmount = () => act(() => root.unmount());

  render(initialProps);

  return { result, rerender, unmount };
}

interface TestComponentProps<Result, Props> {
  hook: (props: Props) => Result;
  props: Props | undefined;
  result: { current: Result };
}

function TestComponent<Result, Props>({
  hook,
  props,
  result,
}: TestComponentProps<Result, Props>) {
  result.current = hook(props as Props);
  return null;
}

export { customRenderHook, act };
