import fs from "fs";
import path from "path";

const directoryPath = "./src/content/cars";

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach((file) => {
    if (path.extname(file) === ".md" || path.extname(file) === ".mdx") {
      const filePath = path.join(directoryPath, file);
      let content = fs.readFileSync(filePath, "utf8");

      // 1. Remove the deleted specification lines
      content = content
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          return (
            !trimmed.startsWith("mileage:") &&
            !trimmed.startsWith("engineSize:") &&
            !trimmed.startsWith("fuelType:")
          );
        })
        .join("\n");

      // 2. Safely migrate any old conditions to the new schema
      content = content
        .replace(/condition:\s*['"]?Used['"]?/g, "condition: Foreign Used")
        .replace(/condition:\s*['"]?New['"]?/g, "condition: Foreign Used");

      fs.writeFileSync(filePath, content, "utf8");
      console.log(`Cleaned and updated: ${file}`);
    }
  });
});
