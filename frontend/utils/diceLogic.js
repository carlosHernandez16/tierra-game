export function getRandomDiceRoll() {
    return Math.floor(Math.random() * 6) + 1;
  }
  
  export function getTokenFromRoll(roll) {
    const tokenMap = {
      1: { field: "terra", name: "Terra Token" },
      2: { field: "investmentTokens", name: "Investment Token" },
      3: { field: "dealTokens", name: "Deal Token" },
      4: { field: "borrowTokens", name: "Borrow Token" },
      5: { field: "voteTokens", name: "Vote Token" },
      6: { field: "developTokens", name: "Develop Token" },
    };
    return tokenMap[roll];
  }
  