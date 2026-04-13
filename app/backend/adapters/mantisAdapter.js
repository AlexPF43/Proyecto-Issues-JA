// adapters/mantisAdapter.js
import soap from "soap";
import dotenv from "dotenv";

dotenv.config();

const MANTIS_URL = process.env.MANTIS_URL;

const USERNAME = process.env.MANTIS_USER;
const PASSWORD = process.env.MANTIS_PASSWORD;

export async function getMantisTickets() {
  try {
    const client = await soap.createClientAsync(MANTIS_URL);

    // Llamada SOAP (equivalente a obtener issues)
    const [result] = await client.mc_project_get_issuesAsync({
      username: process.env.MANTIS_USER,
      password: process.env.MANTIS_PASSWORD,
      project_id: process.env.ID_PROYECTO,
      page_number: 1,
      per_page: 50
    });

    const issues = result.return;

    return issues.map(issue => ({
      id: issue.id,
      source: "mantis",

      title: issue.summary,
      description: issue.description,

      status: issue.status?.name,
      priority: issue.priority?.name,

      created_at: issue.date_submitted,
      updated_at: issue.last_updated,

      reporter: issue.reporter?.name || null,
      assignee: issue.handler?.name || null,

      extra: {
        category: issue.category?.name,
        reproducibility: issue.reproducibility?.name
      }
    }));

  } catch (error) {
    console.error("Error Mantis SOAP:", error);
    return [];
  }
}