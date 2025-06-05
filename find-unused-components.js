const path = require("path");
const glob = require("glob");
const fs = require("fs");

// Configuration
const SRC_DIR = "src";
const COMPONENTS_DIR = path.join(SRC_DIR, "components");
const MAIN_JS_PATH = path.join(SRC_DIR, "main.js");

// Helper function to read file content
function readFile(filePath) {
	try {
		return fs.readFileSync(filePath, "utf8");
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error);
		return "";
	}
}

// Get all Vue components
function getAllComponents() {
	const components = [];
	const files = glob.sync("**/*.vue", { cwd: COMPONENTS_DIR });

	files.forEach((file) => {
		const fullPath = path.join(COMPONENTS_DIR, file);
		const componentName = path.basename(file, ".vue");
		components.push({
			name: componentName,
			path: file,
			fullPath: fullPath,
		});
	});

	return components;
}

// Check if component is imported in a file
function isComponentImported(fileContent, componentName) {
	const importPattern = new RegExp(`import\\s+.*\\s+from\\s+['"].*${componentName}['"]`, "g");
	return importPattern.test(fileContent);
}

// Check if component is used in template
function isComponentUsedInTemplate(fileContent, componentName) {
	const templatePattern = new RegExp(`<${componentName}[\\s>]|<${componentName.toLowerCase()}[\\s>]`, "g");
	return templatePattern.test(fileContent);
}

// Check if component is registered globally in main.js
function isComponentRegisteredGlobally(componentName) {
	const mainJsContent = readFile(MAIN_JS_PATH);
	const registerPattern = new RegExp(`app\\.component\\(['"]${componentName}['"]`, "g");
	return registerPattern.test(mainJsContent);
}

// Check if component is used in dynamic imports
function isComponentUsedInDynamicImport(fileContent, componentName) {
	const dynamicImportPattern = new RegExp(`import\\(['"].*${componentName}['"]\\)`, "g");
	return dynamicImportPattern.test(fileContent);
}

// Main analysis function
function analyzeComponentUsage() {
	const components = getAllComponents();
	const allFiles = glob.sync("**/*.{vue,js,ts}", { cwd: SRC_DIR });
	const unusedComponents = [];

	console.log("Analyzing component usage...\n");

	components.forEach((component) => {
		let isUsed = false;
		let usageDetails = [];

		// Check main.js for global registration
		if (isComponentRegisteredGlobally(component.name)) {
			isUsed = true;
			usageDetails.push("Registered globally in main.js");
		}

		// Check all files for usage
		allFiles.forEach((file) => {
			const filePath = path.join(SRC_DIR, file);
			const content = readFile(filePath);

			if (isComponentImported(content, component.name)) {
				isUsed = true;
				usageDetails.push(`Imported in ${file}`);
			}

			if (isComponentUsedInTemplate(content, component.name)) {
				isUsed = true;
				usageDetails.push(`Used in template of ${file}`);
			}

			if (isComponentUsedInDynamicImport(content, component.name)) {
				isUsed = true;
				usageDetails.push(`Used in dynamic import in ${file}`);
			}
		});

		if (!isUsed) {
			unusedComponents.push({
				name: component.name,
				path: component.path,
			});
		} else {
			console.log(`Component ${component.name} is used:`);
			usageDetails.forEach((detail) => console.log(`  - ${detail}`));
			console.log("");
		}
	});

	// Print results
	if (unusedComponents.length > 0) {
		console.log("\nPotentially unused components:");
		unusedComponents.forEach((component) => {
			console.log(`- ${component.name} (${component.path})`);
		});
	} else {
		console.log("\nNo unused components found!");
	}
}

// Run the analysis
analyzeComponentUsage();
