import fs from "fs";
import path from "path";

const directoryPath = "./src/content/cars";

// Reads all markdown files and converts 'Used' to 'Foreign Used' and 'New' to 'Foreign Used' (or customize as preferred)
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach((file) => {
    if (path.extname(file) === ".md" || path.extname(file) === ".mdx") {
      const filePath = path.join(directoryPath, file);
      let content = fs.readFileSync(filePath, "utf8");

      // Replace frontmatter entries
      let updated = false;
      if (content.includes("condition: Used") || content.includes("condition: 'Used'") || content.includes('condition: "Used"')) {
        content = content
          .replace("condition: Used", "condition: Foreign Used")
          .replace("condition: 'Used'", "condition: Foreign Used")
          .replace('condition: "Used"', "condition: Foreign Used");
        updated = true;
      }
      
      if (content.includes("condition: New") || content.includes("condition: 'New'") || content.includes('condition: "New"')) {
        content = content
          .replace("condition: New", "condition: Foreign Used")
          .replace("condition: 'New'", "condition: Foreign Used")
          .replace('condition: "New"', "condition: Foreign Used");
        updated = true;
      }

      if (updated) {
        fs.writeFileSync(filePath, content, "utf8");
        console.log(`Migrated condition in: ${file}`);
      }
    }
  });
});