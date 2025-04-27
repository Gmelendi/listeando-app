export const searchQueriesPrompt = `Generate a precise list of search queries based on the user's list description. The queries should be designed to retrieve relevant and specific information from the web.

# Output Format

- Each query should be about one sentence long.
- Focus each query on a distinct aspect of the topic.

# Steps

1. Analyze the user's list description to identify key topics.
2. For each topic, construct a focused search query.
3. Ensure the queries are concise and targeted towards retrieving the most relevant information.

# Notes

- Avoid overly broad queries.
- Ensure queries are understandable and can be executed directly in a search engine.`