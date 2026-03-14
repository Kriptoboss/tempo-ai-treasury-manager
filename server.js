import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sendPayment } from "./payments.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("/opt/tempo-ai-treasury"));

app.get("/", (req,res)=>{
  res.send("Tempo AI Treasury Manager running");
});


// WALLET ALIASES

const WALLET_BOOK = {
  marketing: "0x1111111111111111111111111111111111111111",
  ops: "0x2222222222222222222222222222222222222222",
  dev: "0x3333333333333333333333333333333333333333",
  "dev team": "0x3333333333333333333333333333333333333333",
  team: "0x4444444444444444444444444444444444444444",
  contributors: "0x5555555555555555555555555555555555555555"
};


// RECIPIENT BOOK (PAYROLL)

const RECIPIENT_BOOK = {
  alice: "0xaAaAaAaaAaAaAaaAaAAAAAAAAaaaAaAaAaaAaaAa",
  bob: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
  charlie: "0xcCcCCcCcCcCCcCCcCcCcCcCcCcCcCcCcCcCcCcCc"
};


// CURRENCY PARSER

function detectCurrency(text){

  if(text.includes("usdt")) return "usdt";
  if(text.includes("usd")) return "usd";
  if(text.includes("tempo")) return "tempo";

  return "token";
}


// AMOUNT PARSER

function detectAmount(text){

  const match = text.match(/([0-9]*\.?[0-9]+)/);

  if(!match) return null;

  return match[1];
}


// INTENT DETECTION

function detectIntent(text){

  if(text.includes("payroll")) return "payroll";

  if(text.includes("allocate")) return "allocation";

  if(text.includes("pay")) return "payment";

  if(text.includes("send")) return "payment";

  return "unknown";
}


// RECIPIENT DETECTION

function detectRecipient(text){

  for(const name in RECIPIENT_BOOK){

    if(text.includes(name)){

      return {
        label:name,
        address:RECIPIENT_BOOK[name],
        type:"person"
      };

    }

  }

  for(const wallet in WALLET_BOOK){

    if(text.includes(wallet)){

      return {
        label:wallet,
        address:WALLET_BOOK[wallet],
        type:"wallet"
      };

    }

  }

  return null;

}


// COMMAND INTERPRETER

function interpretCommand(command){

  const text = command.toLowerCase();

  const intent = detectIntent(text);

  const amount = detectAmount(text);

  const currency = detectCurrency(text);

  const recipient = detectRecipient(text);

  if(!amount || !recipient){

    return null;

  }

  const paymentType = text.includes("salary") ? "salary" : "transfer";

  return {
    intent,
    amount,
    currency,
    paymentType,
    recipientLabel:recipient.label,
    address:recipient.address,
    recipientType:recipient.type
  };

}



// COMMAND API

app.post("/command", async (req,res)=>{

  const {command} = req.body;

  console.log("User command:",command);

  const interpreted = interpretCommand(command);

  if(!interpreted){

    return res.json({
      status:"error",
      message:"Example commands: send alice 20 usd, pay bob 200 usd salary, allocate 300 usd to marketing"
    });

  }

  try{

    const result = await sendPayment(interpreted.address, interpreted.amount);

    res.json({
      status:"success",
      mode:result.mode,
      tx:result.txHash,
      explorer:`https://explorer.tempo.xyz/tx/${result.txHash}`,

      intent:interpreted.intent,
      paymentType:interpreted.paymentType,
      amount:interpreted.amount,
      currency:interpreted.currency,
      recipientLabel:interpreted.recipientLabel,
      recipientType:interpreted.recipientType

    });

  }catch(err){

    res.json({
      status:"error",
      message:"Transaction failed"
    });

  }

});



const PORT = process.env.PORT || 3000;

app.listen(PORT,"0.0.0.0",()=>{

  console.log("Server running on port",PORT);

});
