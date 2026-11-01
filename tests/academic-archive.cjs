const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
	const source = fs.readFileSync("src/helpers/academic-archive.js", "utf8");
	const { archiveDocuments, displayArchiveValue } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
	assert.equal(displayArchiveValue([{ id: 1, value: "Demo" }]), "Demo");
	assert.equal(displayArchiveValue(false), "Ne");
	assert.equal(displayArchiveValue(null), "—");
	const documents = [{ id: "1", source_url: "file-a" }, { id: "2", source_url: "file-b" }];
	assert.deepEqual(archiveDocuments({ documents }, [{ upload: [{ url: "file-a" }] }, { pdf_attachment_url: "file-a" }]), [documents[0]]);
	assert.deepEqual(archiveDocuments({ documents }, [{ url: "missing" }]), []);
	console.log("Academic archive display/document checks passed");
})();
