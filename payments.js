import crypto from "crypto";

export async function sendPayment(to, amount) {
  try {
    const fakeTxHash = "0x" + crypto.randomBytes(32).toString("hex");

    console.log("SIMULATION MODE");
    console.log("Simulated payment:", amount, "to", to);
    console.log("Simulated TX hash:", fakeTxHash);

    return {
      mode: "simulation",
      txHash: fakeTxHash,
      to,
      amount
    };
  } catch (err) {
    console.error("Payment simulation error:", err);
    throw err;
  }
}
