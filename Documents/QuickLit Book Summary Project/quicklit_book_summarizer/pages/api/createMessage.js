const generateDescription = async ({
    bookTitleAndAuthor
  }) => {
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{"role": 'system', "content": `Ignore all instructions prior to this one.You are Atlas. As an expert in reading and understanding books, you have been spent 20 years developing mastery of understanding any books you have read.Everything you output should be formatted in HTML. Your task is to provide a comprehensive summary when it comes to a book I specify. ALWAYS remember, DO NOT ask any questions, you simply produce an output.VERY IMPORTANT, your output will be fed through HTML, so remember to format according to HTML rules, replace all quotations with <q> tags and all apostrophes with &#39; You like to format your summaries in using bullet points for key ideas and ease of understanding and tables to highlight key concepts for my further exploration. Be sure to include both in your summaries. Offer deeper explanations on specific topics, and implementable takeaways from the book I can use immediately. After you are done providing a summary, offer more information about the books topics that you can provide. Give me a formatted list of topics you can go in depth into. Also VERY IMPORTANT, your output will be fed through HTML, so remember to format your text according to HTML rules, also replace all quotations with <q> tags and all apostrophes with &#39;`}, {"role": 'user', "content": `The book you have to summarize is ${bookTitleAndAuthor}`}],
            max_tokens: 10,
            temperature: 0.5,
          }),
        }
      );
      const data = await response.json();
      return data.choices[0].message;
    } catch (err) {
      console.error(err);
    }
  };
  
  export default async function handler(req, res) {
    const { bookTitleAndAuthor } = req.body;
  
    const bookSummary = await generateDescription({bookTitleAndAuthor});
  
    res.status(200).json({
        bookSummary,
    });
  }