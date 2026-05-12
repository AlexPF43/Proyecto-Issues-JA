import * as soap from "soap";
import dotenv from "dotenv";

dotenv.config();

const wsdl = `${process.env.MANTIS_URL}/api/soap/mantisconnect.php?wsdl`;

export async function getMantisTickets() {

  const client = await soap.createClientAsync(wsdl);

  const [result] = await client.mc_project_get_issuesAsync({
    username: process.env.MANTIS_USER,
    password: process.env.MANTIS_PASSWORD,
    project_id: process.env.ID_PROYECTO,
    page_number: 1,
    per_page: 50
  });

  let issues = result?.return?.item || [];

  if (!Array.isArray(issues)) {
    issues = [issues];
  }

  return issues.map(issue => {
    const idValue = issue.id?.$value || issue.id?._ || issue.id;
    const mapped = {
      id: idValue,
      external_id: idValue,
      title: issue.summary?.$value || issue.summary?._,
      description: issue.description?.$value || issue.description?._,
      status: issue.status?.name?.$value || issue.status?.name?._,
      priority: issue.priority?.name?.$value || issue.priority?.name?._,
      created_at: issue.date_submitted?.$value,
      updated_at: issue.last_updated?.$value,
      reporter: issue.reporter?.name?.$value,
      assignee: issue.handler?.name?.$value
    };
    return mapped;
  });
}