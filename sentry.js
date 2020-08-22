const fs = require("fs");
const SentryCli = require("@sentry/cli");

function truncateHash(hash) {
    return hash.trim().substring(0, 7)
}

function getShortHash() {
    const rev = fs.readFileSync(".git/HEAD").toString();
    if (rev.indexOf(':') === -1) {
        return truncateHash(rev);
    } else {
        const refPath = ".git/" + rev.substring(5).trim();
        const hash = fs.readFileSync(refPath).toString();
        return truncateHash(hash);
    }
}

function getVersion() {
    let pjson = require('./package.json');
    return pjson.version;
}

async function createReleaseAndUpload() {
    const release = getVersion();

    if (!release) {
        console.warn("Could not find git hash for Sentry release specifier");
        return;
    }

    const cli = new SentryCli();

    try {
        console.log("Creating sentry release " + release);
        await cli.releases.new(release);
        console.log("Uploading source maps");
        await cli.releases.uploadSourceMaps(release, {
            include: ["build/static/js"],
            urlPrefix: "~/static/js",
            rewrite: false
        });
        console.log("Finalizing release");
        await cli.releases.finalize(release);
    } catch (e) {
        console.error("Source maps uploading failed:", e);
    }
}

createReleaseAndUpload();