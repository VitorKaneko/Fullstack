import { pool } from '../config/database.js'

export class UserModel {
  static async findByEmail(email) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return rows[0] || null
  }
}