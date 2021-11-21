const markerNameA = "example-marker-a"
const markerNameB = "example-marker-b"

function PerformanceTester(calle, f, params, loop1 = 25, loop2 = 32, loop3 = 1024) {
    let results = 0;
    for (let x = 0; x < loop1; ++x) {
        for (let i2 = 0; i2 < loop2; ++i2) {
            performance.mark(markerNameA);
            for (let i = 0; i < loop3; ++i) {
                f.call(calle, ...params);
            }
            performance.mark(markerNameB);
            performance.measure("measure a to b", markerNameA, markerNameB);
        }

        let perf = performance.getEntriesByType("measure");
        let totalTime = 0;
        for (let i = 0, l = perf.length; i < l; ++i) {
            totalTime += perf[i].duration;
        }
        results += totalTime / loop2;
        performance.clearMeasures('measure a to b');
    }
    console.log(results / loop1);
}

export { PerformanceTester };