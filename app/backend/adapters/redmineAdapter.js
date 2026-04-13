// adapters/redmineAdapter.js
import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

const REDMINE_URL = process.env.REDMINE_URL;

console.log("REDMINE_URL:", REDMINE_URL);
export async function getRedmineTickets() {
  const response = await axios.get(REDMINE_URL);

  return response.data.issues.map(issue => ({
    id: issue.id,
    source: "redmine",
    title: issue.subject,
    description: issue.description,
    status: issue.status.name,
    priority: issue.priority.name,
    created_at: issue.created_on,
    updated_at: issue.updated_on
  }));
}
