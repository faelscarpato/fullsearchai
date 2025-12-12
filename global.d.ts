export { };

declare global {
    interface Window {
        aistudio: {
            openSelectKey?: () => Promise<void>;
            [key: string]: any;
        };
    }
}
