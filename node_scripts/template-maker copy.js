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

    const zipOutput = doc.getZip();
    const docXml = zipOutput.file("word/document.xml").asText();

    const updatedXml = docXml.replace(
        `<w:t>${name}</w:t>`,
        `<w:p><w:r><w:t>{%signature}</w:t></w:r></w:p><w:p><w:r><w:t>{date}</w:t></w:r></w:p><w:p><w:r><w:t>${name}</w:t></w:r></w:p>`
      );

    if (updatedXml === docXml) {
        throw new Error("Name not found in the document. Please check the input name.");
    }
    zipOutput.file("word/document.xml", updatedXml);
    const buffer = zipOutput.generate({ type: "nodebuffer" });
    fs.writeFileSync(outputPath, buffer);
    console.log("Document processed successfully.");
  } catch (error) {
    console.error("Error processing document:", error);
    throw error;
  }
}


const args = process.argv.slice(2);
if (args.length !== 3) {
  console.error(
    console.error("Arguments received:", { templatePath, outputPath, name })
  );
  process.exit(1);
}

const [templatePath, outputPath, name] = args;

processDoc(templatePath, outputPath, name);
