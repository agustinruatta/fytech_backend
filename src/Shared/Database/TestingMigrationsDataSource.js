"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MigrationsDataSource_1 = require("./MigrationsDataSource");
const typeorm_1 = require("typeorm");
const databaseUrl = 'postgres://fytech_test:test@postgres_test:5432/fytech_test';
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    url: databaseUrl,
    migrationsRun: true,
    migrationsTableName: 'migrations',
    migrations: MigrationsDataSource_1.default.options.migrations,
    synchronize: false,
});
//# sourceMappingURL=TestingMigrationsDataSource.js.map