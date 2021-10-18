const express = require('express');
// const { ApolloServer } = require('apollo-server-express');
const { ApolloServer } = require("apollo-server-express");
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');
const { loadFilesSync } = require('@graphql-tools/load-files');
require('dotenv').config();
const { authCheckMiddleware } = require('./helpers/auth');
const cors = require('cors');
const cloudinary = require('cloudinary');

// Express Server
const app = express();

// DB (MongoDB)
const db = async () => {
  try {
    const success = await mongoose.connect(process.env.DATABASE_CLOUD, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    console.log(`DB Connected ${process.env.DATABASE_CLOUD}`);
  } catch (error) {
    console.log('DB Connection error: ', error);
  }
};
db();

// middlewares
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// typeDefs
const typeDefs = mergeTypeDefs(
  loadFilesSync(path.join(__dirname, './typeDefs'))
);

// resolvers
const resolvers = mergeResolvers(
  loadFilesSync(path.join(__dirname, './resolvers'))
);

// GraphQL Server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })
});

// Vinculation Apollo Server with express framework
apolloServer.applyMiddleware({ app });

// Server
const httpServer = http.createServer(app);

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Rest EndPoint
app.get('/rest', authCheckMiddleware, (req, res) => {
  res.json({
    data: 'you hit rest endpoint great!'
  });
});

// upload clodinary
app.post('/upload-images', authCheckMiddleware, (req, res) => {
  cloudinary.uploader.upload(
    req.body.image,
    (result) => {
      console.log(result);
      res.send({
        url: result.secure_url,
        public_id: result.public_id
      });
    },
    {
      public_id: `${Date.now()}`, // public name
      resource_type: "auto" // JPEG, PNG
    }
  );
});

// remove images
app.post('/remove-images', authCheckMiddleware, (req, res) => {
  const image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) return res.json({ success: false, error });
    res.send('Ok');
  });
});

// Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, function () {
  console.log(`Server is ready at http://localhost:${PORT}`);
  console.log(`GraphQL server is ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
});
