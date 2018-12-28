import assert from 'assert'

it('fetches data from crypto', () => {
  fetch(`https://min-api.cryptocompare.com/data/all/coinlist?api_key=${process.env.API_KEY}`)
    .then(res => res.json())
    .then(data => {
      assert(data.Data)
    });
});
