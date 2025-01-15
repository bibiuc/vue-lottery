import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
    schema: './server/lib/schema.ts',
    out: './server/db/migrations',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
