import { importSchema } from "graphql-import";
import path from "path";
import { gql } from "apollo-server-express";

export default gql(importSchema(path.resolve(__dirname, "./schema.graphql")));
