const data = {
    contest_id: '657a9d5b69a7b17d04b7e306',
    ranksAndPrices: new Map([
      ['1', 10000],
      ['2', 5000],
      ['3', 2500],
      ['4', 1500],
      ['5', 1000],
      ['6', 500],
      ['7', 250],
      ['100', 50],
      ['8-10', 200],
      ['11-100', 100]
    ])
  };
  
  const desiredRank = '9';
  const prizeAmount = data.ranksAndPrices.get(desiredRank);
  
  console.log(`The prize amount for rank ${desiredRank} is ${prizeAmount}`);