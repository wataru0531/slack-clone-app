import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyChannel1745148439021 implements MigrationInterface {
    name = 'ModifyChannel1745148439021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
        await queryRunner.query(`CREATE TABLE "temporary_channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_channel"("id", "name", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "workspaceId", "createdAt", "updatedAt" FROM "channel"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
        await queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "channel"("id", "name", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "workspaceId", "createdAt", "updatedAt" FROM "temporary_channel"`);
        await queryRunner.query(`DROP TABLE "temporary_channel"`);
        await queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
    }

}
