# Tempo AI Treasury Copilot

AI-powered treasury and payroll copilot for on-chain teams.

## Overview

Tempo AI Treasury Copilot converts natural-language commands into structured treasury operations.

Users can type commands like:

- send alice 20 usd
- pay bob 200 usd salary
- allocate 300 usd to marketing
- send charlie 50 usdt

The system interprets the command, resolves the recipient, detects the amount and currency, and generates a treasury transaction through a clean dashboard.

## Features

- Natural-language treasury commands
- AI command interpretation
- Payroll-ready command support
- Recipient and wallet alias resolution
- Currency detection
- Treasury simulation engine
- Live dashboard demo

## Live Demo

http://46.62.230.195:3000/dashboard.html

## Example Commands

- send alice 20 usd
- pay bob 200 usd salary
- allocate 300 usd to marketing
- send charlie 50 usdt

## How It Works

1. User enters a treasury command
2. AI interpreter extracts intent, recipient, amount, and currency
3. Treasury engine generates a simulated settlement transaction
4. Result is displayed in the dashboard with explorer link

## Architecture

Frontend Dashboard  
↓  
AI Command Interpreter  
↓  
Treasury Execution Engine  
↓  
Settlement Adapter  
↓  
Tempo Explorer

## Built For

Tempo Hackathon
