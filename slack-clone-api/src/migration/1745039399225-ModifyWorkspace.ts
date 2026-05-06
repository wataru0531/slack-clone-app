import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyWorkspace1745039399225 implements MigrationInterface {
    name = 'ModifyWorkspace1745039399225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "adminUserId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "temporary_workspace"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "workspace"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
        await queryRunner.query(`ALTER TABLE "temporary_workspace" RENAME TO "workspace"`);
        await queryRunner.query(`CREATE INDEX "IDX_e1b802b7f9f6f600162cb1c073" ON "workspace" ("adminUserId") `);
        await queryRunner.query(`DROP INDEX "IDX_e1b802b7f9f6f600162cb1c073"`);
        await queryRunner.query(`CREATE TABLE "temporary_workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "adminUserId" varchar NOT NULL, CONSTRAINT "FK_e1b802b7f9f6f600162cb1c073d" FOREIGN KEY ("adminUserId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_workspace"("id", "name", "createdAt", "updatedAt", "adminUserId") SELECT "id", "name", "createdAt", "updatedAt", "adminUserId" FROM "workspace"`);
        await queryRunner.query(`DROP TABLE "workspace"`);
        await queryRunner.query(`ALTER TABLE "temporary_workspace" RENAME TO "workspace"`);
        await queryRunner.query(`CREATE INDEX "IDX_e1b802b7f9f6f600162cb1c073" ON "workspace" ("adminUserId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_e1b802b7f9f6f600162cb1c073"`);
        await queryRunner.query(`ALTER TABLE "workspace" RENAME TO "temporary_workspace"`);
        await queryRunner.query(`CREATE TABLE "workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "adminUserId" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "workspace"("id", "name", "createdAt", "updatedAt", "adminUserId") SELECT "id", "name", "createdAt", "updatedAt", "adminUserId" FROM "temporary_workspace"`);
        await queryRunner.query(`DROP TABLE "temporary_workspace"`);
        await queryRunner.query(`CREATE INDEX "IDX_e1b802b7f9f6f600162cb1c073" ON "workspace" ("adminUserId") `);
        await queryRunner.query(`DROP INDEX "IDX_e1b802b7f9f6f600162cb1c073"`);
        await queryRunner.query(`ALTER TABLE "workspace" RENAME TO "temporary_workspace"`);
        await queryRunner.query(`CREATE TABLE "workspace" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "workspace"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "temporary_workspace"`);
        await queryRunner.query(`DROP TABLE "temporary_workspace"`);
    }

}
