/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from "react";
import JSZip from "jszip";
// @ts-expect-error
import { saveAs } from "file-saver";
import axios from "axios";
import {
  authControllerFileContent,
  authMiddlewareFileContent,
  authRouteFileContent,
  indexFileContent,
  tsConfigFileContent,
  userModalFileContent,
  validatorFileContent,
} from "./files/controller";

function App() {
  const [projectName, setProjectName] = useState("");

  const handleGenerate = async () => {
    const zip = new JSZip();

    // Fetch latest versions of packages (optional)
    let expressVersion,
      bodyParserVersion,
      dotenvVersion,
      mongooseVersion,
      corsVersion,
      jsonwebtokenVersion,
      validatorVersion,
      bcryptjsVersion,
      typescriptVersion,
      expressTypesVersion,
      corsTypesVersion,
      jsonwebtokenTypesVersion,
      mongooseTypesVersion,
      validatorTypesVersion,
      bcryptjsTypesVersion,
      tsNodeDevVersion,
      tsNodeVersion;

    try {
      const [
        expressResponse,
        bodyParserResponse,
        dotenvResponse,
        mongooseResponse,
        corsResponse,
        jsonwebtokenResponse,
        validatorResponse,
        bcryptjsResponse,
        typescriptResponse,
        expressTypesResponse,
        corsTypesResponse,
        jsonwebtokenTypesResponse,
        mongooseTypesResponse,
        validatorTypesResponse,
        bcryptjsTypesResponse,
        tsNodeResponse,
        tsNodeDevResponse,
      ] = await Promise.all([
        axios.get("https://registry.npmjs.org/express/latest"),
        axios.get("https://registry.npmjs.org/body-parser/latest"),
        axios.get("https://registry.npmjs.org/dotenv/latest"),
        axios.get("https://registry.npmjs.org/mongoose/latest"),
        axios.get("https://registry.npmjs.org/cors/latest"),
        axios.get("https://registry.npmjs.org/jsonwebtoken/latest"),
        axios.get("https://registry.npmjs.org/validator/latest"),
        axios.get("https://registry.npmjs.org/bcryptjs/latest"),
        axios.get("https://registry.npmjs.org/typescript/latest"),
        axios.get("https://registry.npmjs.org/@types/express/latest"),
        axios.get("https://registry.npmjs.org/@types/cors/latest"),
        axios.get("https://registry.npmjs.org/@types/jsonwebtoken/latest"),
        axios.get("https://registry.npmjs.org/@types/mongoose/latest"),
        axios.get("https://registry.npmjs.org/@types/validator/latest"),
        axios.get("https://registry.npmjs.org/@types/bcryptjs/latest"),
        axios.get("https://registry.npmjs.org/ts-node/latest"),
        axios.get("https://registry.npmjs.org/ts-node-dev/latest"),
      ]);

      expressVersion = expressResponse.data.version;
      bodyParserVersion = bodyParserResponse.data.version;
      dotenvVersion = dotenvResponse.data.version;
      mongooseVersion = mongooseResponse.data.version;
      corsVersion = corsResponse.data.version;
      jsonwebtokenVersion = jsonwebtokenResponse.data.version;
      validatorVersion = validatorResponse.data.version;
      bcryptjsVersion = bcryptjsResponse.data.version;
      typescriptVersion = typescriptResponse.data.version;

      expressTypesVersion = expressTypesResponse.data.version;
      corsTypesVersion = corsTypesResponse.data.version;
      jsonwebtokenTypesVersion = jsonwebtokenTypesResponse.data.version;
      mongooseTypesVersion = mongooseTypesResponse.data.version;
      validatorTypesVersion = validatorTypesResponse.data.version;
      bcryptjsTypesVersion = bcryptjsTypesResponse.data.version;
      tsNodeDevVersion = tsNodeDevResponse.data.version;
      tsNodeVersion = tsNodeResponse.data.version;
    } catch (error) {
      console.error("Error fetching package versions:", error);
      return;
    }

    // Create directory structure and files
    const projectFolder = zip.folder(projectName);

    // Create src folder
    //@ts-ignore

    const srcFolder = projectFolder.folder("src");

    // Create controllers, models, routes, utils, config folders
    //@ts-ignore

    srcFolder
      .folder("controllers")
      .file("authController.ts", authControllerFileContent);
    //@ts-ignore

    srcFolder.folder("models").file("authModal.ts", userModalFileContent);
    //@ts-ignore

    srcFolder.folder("db").file("databaseConnect.ts", `// Model code`);
    //@ts-ignore

    srcFolder
      .folder("middleware")
      .file("authMiddleware.ts", authMiddlewareFileContent);
    //@ts-ignore

    srcFolder.folder("routes").file("authRoutes.ts", authRouteFileContent);
    //@ts-ignore

    srcFolder.folder("utils").file("validator.ts", validatorFileContent);
    //@ts-ignore

    srcFolder.folder("config").file("dotenvConfig.ts", `// Config code`);
    //@ts-ignore

    // Create index.ts
    srcFolder.file("index.ts", indexFileContent);
    //@ts-ignore

    // Create .env file
    projectFolder.file(
      ".env",
      `
      PORT=3000
      MONGO_URI=mongodb://localhost:27017/mydatabase
      JWT_SECRET=mysecretkey
    `
    );
    //@ts-ignore

    // Create tsconfig.json
    projectFolder.file("tsconfig.json", tsConfigFileContent);

    //@ts-ignore
    // Create package.json
    projectFolder.file(
      "package.json",
      JSON.stringify(
        {
          name: projectName,
          version: "1.0.0",
          description: "Node.js project with TypeScript",
          main: "./dist/index.js",
          scripts: {
            start: "ts-node-dev --respawn src/index.ts",
            build: "tsc",
          },
          keywords: [],
          author: "",
          license: "MIT",
          dependencies: {
            bcryptjs: `^${bcryptjsVersion}`,
            "body-parser": `^${bodyParserVersion}`,
            cors: `^${corsVersion}`,
            dotenv: `^${dotenvVersion}`,
            express: `^${expressVersion}`,
            jsonwebtoken: `^${jsonwebtokenVersion}`,
            mongoose: `^${mongooseVersion}`,
            validator: `^${validatorVersion}`,
          },
          devDependencies: {
            "@types/bcryptjs": `^${bcryptjsTypesVersion}`,
            "@types/cors": `^${corsTypesVersion}`,
            "@types/express": `^${expressTypesVersion}`,
            "@types/jsonwebtoken": `^${jsonwebtokenTypesVersion}`,
            "@types/mongoose": `^${mongooseTypesVersion}`,
            "@types/node": "^16.11.12", // Replace with your specific version if needed
            "@types/validator": `^${validatorTypesVersion}`,
            "ts-node": `${tsNodeVersion}`,
            "ts-node-dev": `${tsNodeDevVersion}`,
            typescript: `${typescriptVersion}`,
          },
        },
        null,
        2
      )
    );

    // Generate and download zip
    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, `${projectName}.zip`);
    });
  };

  return (
    <div className="flex justify-center h-screen w-screen align-middle items-center bg-gradient-to-b from-black to-green-950 text-white">
      <div className="flex flex-col justify-center items-center align-middle ">
        <h1 className="text-4xl my-10 neon-text font-extrabold">
          Node.js Project Generator
        </h1>
        <div className="bg-green-800 bg-opacity-45 w-32 h-32 rounded-lg grid place-content-center">
          <img src="https://pluralsight2.imgix.net/paths/images/nodejs-45adbe594d.png" />
        </div>
        <form className="flex my-5 flex-col justify-center items-center align-middle">
          <div>
            <input
              type="text"
              className="rounded-lg h-10 px-4 w-52 bg-green-700 bg-opacity-30 text-white placeholder-green-800 focus:text-white focus:placeholder-green-800 border-none focus:outline-none"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <button
            className="bg-gradient-to-tl from-green-900 to-green-800 text-green-400   my-4  px-10 py-4 rounded-lg"
            type="button"
            onClick={handleGenerate}
          >
            Generate Project
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
