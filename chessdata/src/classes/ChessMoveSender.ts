interface Moves {
  [key: string]: string; // Adjust based on the structure of the `moves` object you're sending.
}

export class ChessMoveSender {
  baseUrl: string;

  constructor() {
    this.baseUrl = "http://localhost:8080/api";
  }

  async storeMoves(moves: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/saveGame`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moves),
      });

      if (response.ok) {
        const data = await response.text();
        console.log("Response:", data);
        return data;
      } else {
        const error = new Error("Request failed!");
        (error as any).status = response.status; // Casting to any to add custom properties
        throw error;
      }
    } catch (error) {
      console.error("Error storing moves:", error);
      throw error;
    }
  }
}
