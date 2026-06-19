import { pool } from '../config/database.js'

export class TeamModel {
  static async searchByName(name) {
    const { rows } = await pool.query(
      'SELECT * FROM teams WHERE LOWER(str_team) LIKE LOWER($1)',
      [`%${name}%`]
    )
    return rows
  }

  static async create({ strTeam, strCountry, strStadium, strTeamBadge, createdBy }) {
    const { rows } = await pool.query(
      `INSERT INTO teams (str_team, str_country, str_stadium, str_team_badge, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [strTeam, strCountry, strStadium, strTeamBadge, createdBy]
    )
    return rows[0]
  }
}