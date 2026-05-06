import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateTables1745148221914 implements MigrationInterface {
    name = 'GenerateTables1745148221914'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
        await queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
        await queryRunner.query(`CREATE TABLE "workspace_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_ee0d54b3d049b16a596d0be61d" ON "workspace_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0c0d4527c85db43fce8740df6" ON "workspace_user" ("workspaceId") `);
        await queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
        await queryRunner.query(`CREATE TABLE "temporary_channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_885f1a3a3369b4cfa36bfd2e83f" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_channel"("id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt" FROM "channel"`);
        await queryRunner.query(`DROP TABLE "channel"`);
        await queryRunner.query(`ALTER TABLE "temporary_channel" RENAME TO "channel"`);
        await queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
        await queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
        await queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
        await queryRunner.query(`CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "userId", "channelId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt" FROM "message"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
        await queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
        await queryRunner.query(`DROP INDEX "IDX_ee0d54b3d049b16a596d0be61d"`);
        await queryRunner.query(`DROP INDEX "IDX_c0c0d4527c85db43fce8740df6"`);
        await queryRunner.query(`CREATE TABLE "temporary_workspace_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_ee0d54b3d049b16a596d0be61d9" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c0c0d4527c85db43fce8740df63" FOREIGN KEY ("workspaceId") REFERENCES "workspace" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_workspace_user"("id", "userId", "workspaceId", "createdAt") SELECT "id", "userId", "workspaceId", "createdAt" FROM "workspace_user"`);
        await queryRunner.query(`DROP TABLE "workspace_user"`);
        await queryRunner.query(`ALTER TABLE "temporary_workspace_user" RENAME TO "workspace_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_ee0d54b3d049b16a596d0be61d" ON "workspace_user" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c0c0d4527c85db43fce8740df6" ON "workspace_user" ("workspaceId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_c0c0d4527c85db43fce8740df6"`);
        await queryRunner.query(`DROP INDEX "IDX_ee0d54b3d049b16a596d0be61d"`);
        await queryRunner.query(`ALTER TABLE "workspace_user" RENAME TO "temporary_workspace_user"`);
        await queryRunner.query(`CREATE TABLE "workspace_user" ("id" varchar PRIMARY KEY NOT NULL, "userId" varchar NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "workspace_user"("id", "userId", "workspaceId", "createdAt") SELECT "id", "userId", "workspaceId", "createdAt" FROM "temporary_workspace_user"`);
        await queryRunner.query(`DROP TABLE "temporary_workspace_user"`);
        await queryRunner.query(`CREATE INDEX "IDX_c0c0d4527c85db43fce8740df6" ON "workspace_user" ("workspaceId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ee0d54b3d049b16a596d0be61d" ON "workspace_user" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
        await queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
        await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
        await queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text NOT NULL, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "message"("id", "content", "userId", "channelId", "createdAt", "updatedAt") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt" FROM "temporary_message"`);
        await queryRunner.query(`DROP TABLE "temporary_message"`);
        await queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
        await queryRunner.query(`ALTER TABLE "channel" RENAME TO "temporary_channel"`);
        await queryRunner.query(`CREATE TABLE "channel" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "isPrivate" boolean NOT NULL, "workspaceId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "channel"("id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt") SELECT "id", "name", "isPrivate", "workspaceId", "createdAt", "updatedAt" FROM "temporary_channel"`);
        await queryRunner.query(`DROP TABLE "temporary_channel"`);
        await queryRunner.query(`CREATE INDEX "IDX_885f1a3a3369b4cfa36bfd2e83" ON "channel" ("workspaceId") `);
        await queryRunner.query(`DROP INDEX "IDX_c0c0d4527c85db43fce8740df6"`);
        await queryRunner.query(`DROP INDEX "IDX_ee0d54b3d049b16a596d0be61d"`);
        await queryRunner.query(`DROP TABLE "workspace_user"`);
        await queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
        await queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP INDEX "IDX_885f1a3a3369b4cfa36bfd2e83"`);
        await queryRunner.query(`DROP TABLE "channel"`);
    }

}
