import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import ImageModule from "docxtemplater-image-module-free";


function getImage(tagValue) {
  return fs.readFileSync(tagValue);
}

function getSize() {
  return [150, 80];
}

async function processDoc(templatePath, outputPath, data) {
  try {
    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);

    const imageModule = new ImageModule({
      centered: false,
      getImage,
      getSize,
    });

    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
    });
    doc.render(data);

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, buffer);
    console.log("Document processed successfully.");
  } catch (error) {
    console.error("Error processing document:", error);
    process.exit(1);
  }
}

// Command-line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error("Usage: node process-doc.js <templatePath> <outputPath> <dataFilePath>");
  process.exit(1);
}

const [templatePath, outputPath, dataFilePath] = args;

// Read and parse JSON data from the file
let data;
try {
  const dataContent = fs.readFileSync(dataFilePath, "utf-8");
  data = JSON.parse(dataContent);
} catch (error) {
  console.error("Error parsing JSON data:", error);
  process.exit(1);
}

// Process the document
processDoc(templatePath, outputPath, data);