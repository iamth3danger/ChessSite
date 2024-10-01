module.exports = class ChessMoveSender {
  constructor() {
    this.baseUrl = "http://localhost:8080/api";
  }

  async storeMoves(moves) {
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
        error.status = response.status;
        throw error;
      }
    } catch (error) {
      console.error("Error storing moves:", error);
      throw error;
    }
  }
};
