export async function ConnectToServer() {
  try {
    const response = await fetch("http://localhost:5091/api/routes");
    if (!response.ok) {
      throw new Error("Failed to fetch routes");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error getting routes:", error);
    throw error;
  }
}