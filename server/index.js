import express from 'express';
import * as cheerio from 'cheerio';
import cors from 'cors';

const PORT = 8000;
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api', async (req, res) => {
  try {
    const { tag, url } = req.body;
    const request = await fetch(url);
    const response = await request.text();
    const $ = cheerio.load(response);

    const elements = [];
    $(`${tag}`).each((_idx, el) => {
      let element;
      if (tag === 'img') {
        element = $(el).attr('src');
      } else if (tag === 'a') {
        element = $(el).attr('href');
      } else {
        element = $(el).text();
      }
      elements.push(element);
    });
    res.send(elements);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
