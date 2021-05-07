import { hash } from 'bcryptjs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export default class CreateFirstAdminUser1620167849186
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hashedPassword = await hash('secret_password', 8);

    await queryRunner.query(
      `INSERT INTO users (name, cpf, email, password, deliveryman) VALUES ('Admin', '00000000000', 'admin@email.com', '${hashedPassword}', '0')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "DELETE FROM users WHERE email = 'admin@email.com'",
    );
  }
}
