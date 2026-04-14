import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

const MANTIS_URL = process.env.MANTIS_URL;
const TOKEN = process.env.MANTIS_TOKEN;

console.log("MANTIS_URL:", MANTIS_URL);
console.log("MANTIS_TOKEN:", TOKEN);

export async function getMantisTickets() {
  const response = await axios.get(MANTIS_URL, {
    headers: {
      Authorization: TOKEN
    }
  });
  return response.data.issues.map(issue => ({
    id: issue.id,
    source: "mantis",
    title: issue.summary,
    description: issue.description,
    status: issue.status.name,
    priority: issue.priority.name,
    created_at: issue.created_at,
    updated_at: issue.updated_at
  }));
}