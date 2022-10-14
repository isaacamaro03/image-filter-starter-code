import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

type FilteredImageQueryArguments = { image_url: string };

(async () => {
  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req, res) => {
    const queryArgs: FilteredImageQueryArguments = req.query;

    if (!queryArgs.image_url) {
      return res.status(400).json({ message: "The query argument \"image_url\" is required" });
    }

    const filteredpath: string = await filterImageFromURL(queryArgs.image_url);

    res.sendFile(filteredpath, (err) => {
      if (err) {
        res.status(500).json({ message: "Could not send the filtered image" });
      }
      deleteLocalFiles([filteredpath]);
    });
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();