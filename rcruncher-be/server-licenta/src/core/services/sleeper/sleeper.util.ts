const defaultDelay = 1001;
export function sleeper(ms = defaultDelay) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
