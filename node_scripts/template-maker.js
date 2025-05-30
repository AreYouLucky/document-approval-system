import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";

async function processDoc(templatePath, outputPath, name) {
  try {
    console.log("Template Path:", templatePath);
    console.log("Output Path:", outputPath);
    console.log("Name to target:", name);

    const content = fs.readFileSync(templatePath, "binary");
    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Access the original XML content
    const zipOutput = doc.getZip();
    const docXml = zipOutput.file("word/document.xml").asText();

    // Define the XML structure to insert
    const insertion = `
      <w:p>
        <w:r>
          <w:t>{%signature}</w:t>
        </w:r>
      </w:p>
      <w:p>
        <w:r>
          <w:t>{date}</w:t>
        </w:r>
      </w:p>
    `;

    // Replace the XML structure containing "John Doe"
    const updatedXml = docXml.replace(
      /<w:p>[\s\S]*?<w:t>John<\/w:t>[\s\S]*?<w:t>Doe<\/w:t>[\s\S]*?<\/w:p>/g,
      `${insertion}$&`
    );

    // Replace the document.xml content with the updated XML
    zipOutput.file("word/document.xml", updatedXml);

    // Generate the modified document and save it
    const buffer = zipOutput.generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, buffer);

    console.log("Document processed successfully.");
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
}

// Read command-line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error("Usage: node script.js <templatePath> <outputPath> <name>");
  process.exit(1);
}

const [templatePath, outputPath, name] = args;

// Process the document
processDoc(templatePath, outputPath, name);
