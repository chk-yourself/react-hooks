interface IdleProps {
    idleTime: number;
    onIdle?: () => void;
    onActive?: () => void;
}
declare const useIdle: ({ idleTime, onIdle, onActive, }: IdleProps) => boolean;
export default useIdle;
