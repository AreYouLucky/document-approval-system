import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import ImageModule from "docxtemplater-image-module-free";

function getImage(tagValue, imagePath) {
  console.log("Image path:", tagValue);
  return fs.readFileSync(imagePath);
}

function getSize() {
  return [150, 150];
}

async function processDoc(templatePath, outputPath, imagePath, date, tag_name) {
  try {
    console.log("Template Path:", templatePath);
    console.log("Output Path:", outputPath);
    console.log("Image Path:", imagePath);
    console.log("Date:", date);
    console.log("Tag Name:", tag_name);

    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);

    const imageModule = new ImageModule({
      centered: false,
      getImage: (tagValue) => getImage(tagValue, imagePath),
      getSize,
    });

    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
    });

    // Initialize the data object for replacing tags
    const data = {};

    // Add values to the data object only if they are defined
    if (tag_name && imagePath) {
      data[tag_name] = imagePath;
    }
    if (date) {
      data.date = date;
    }

    // Render the document with the data provided
    doc.render(data);

    const buffer = doc.getZip().generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, buffer);
    console.log("Document processed successfully.");
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
}
// Command-line arguments
const args = process.argv.slice(2);
if (args.length !== 5) {
  console.error(
    "Usage: node process-doc.js <templatePath> <outputPath> <imagePath> <date> <tag_name>"
  );
  process.exit(1);
}

const [templatePath, outputPath, imagePath, date, tag_name] = args;

processDoc(templatePath, outputPath, imagePath, date, tag_name);
