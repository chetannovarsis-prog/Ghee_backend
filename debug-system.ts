
const systemPath = require.resolve("@medusajs/payment/dist/providers/system", { paths: [process.cwd()] });
console.log("System path:", systemPath);
const mod = require(systemPath);
console.log("Module keys:", Object.keys(mod));
console.log("Module default:", mod.default);
const loaded = mod.default ?? mod;
console.log("Loaded value type:", typeof loaded);
console.log("Is array:", Array.isArray(loaded));
console.log("Services property:", loaded.services);

try {
    for (const s of loaded) {
        console.log("Iterable element:", s);
    }
} catch (e) {
    console.log("Not iterable via for...of:", e.message);
}
