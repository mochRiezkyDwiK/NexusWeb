import { connect } from "@tidbcloud/serverless";
import { drizzle } from "drizzle-orm/tidb-serverless";
import * as schema from "./schema";

// Pastikan DATABASE_URL di .env sudah benar (tanpa sslaccept=strict di ujung)
const connection = connect({ url: process.env.DATABASE_URL });

export const db = drizzle(connection, { schema });