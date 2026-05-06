import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyChannel1746111421521 implements MigrationInterface {
    name = 'ModifyChannel1746111421521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
        await queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
        await queryRunner.query(`CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "content" text, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageUrl" varchar, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl" FROM "message"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
        await queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
        await queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
        await queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
        await queryRunner.query(`CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "content" text, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageUrl" varchar, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_message"("id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl" FROM "message"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
        await queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
        await queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
        await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
        await queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageUrl" varchar, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "message"("id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl" FROM "temporary_message"`);
        await queryRunner.query(`DROP TABLE "temporary_message"`);
        await queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
        await queryRunner.query(`DROP INDEX "IDX_5fdbbcb32afcea663c2bea2954"`);
        await queryRunner.query(`DROP INDEX "IDX_446251f8ceb2132af01b68eb59"`);
        await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
        await queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "content" text, "userId" varchar NOT NULL, "channelId" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageUrl" varchar, CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_5fdbbcb32afcea663c2bea2954f" FOREIGN KEY ("channelId") REFERENCES "channel" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "message"("id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl") SELECT "id", "content", "userId", "channelId", "createdAt", "updatedAt", "imageUrl" FROM "temporary_message"`);
        await queryRunner.query(`DROP TABLE "temporary_message"`);
        await queryRunner.query(`CREATE INDEX "IDX_5fdbbcb32afcea663c2bea2954" ON "message" ("channelId") `);
        await queryRunner.query(`CREATE INDEX "IDX_446251f8ceb2132af01b68eb59" ON "message" ("userId") `);
    }

}
