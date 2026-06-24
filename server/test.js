import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { MongoClient } from "mongodb";

const uri =
  "mongodb+srv://raktosetuAdmin:Raktosetu910@cluster0.etqas6l.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("✅ Connected Successfully");
} catch (err) {
  console.log("❌ Error:", err);
}