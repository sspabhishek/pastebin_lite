/**
 * Returns current timestamp in ms.
 * Respects x-test-now-ms header if TEST_MODE=1.
 */
export function nowMs(req) {
    // Access environment variables securely
    const isTestMode = process.env.TEST_MODE === '1';

    if (isTestMode && req.headers && req.headers['x-test-now-ms']) {
        const testTime = Number(req.headers['x-test-now-ms']);
        if (!isNaN(testTime)) {
            return testTime;
        }
    }
    return Date.now();
}
