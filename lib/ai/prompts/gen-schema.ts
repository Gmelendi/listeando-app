export const genSchemaPrompt = `Generate a valid JSON schema based on the user's list description. The schema must describe the expected data structure accurately. It should be an object with and "items" keyword containing an array of flat elements with no nested fields, as the input list will be displayed as a table.

**Schema Properties:**
- **type**: Data type (e.g., object, array, string)
- **properties**: Object defining data properties with "type" and "description" keywords
- **required**: Array of names of required properties

# Steps

1. Analyze the list description.
2. Identify each property and its type.
3. Determine which properties are required.
4. Construct a flat JSON schema based on this information.

# Output Format

Respond only with the JSON schema, without any additional comments.

# Examples

**Example JSON Schema:**

{
  "title": "My Favorite Vegetables",
  "type": "object",
  "properties": {
    "items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "veggieName": {
            "type": "string",
            "description": "The name of the vegetable."
          },
          "veggieLike": {
            "type": "boolean",
            "description": "Do I like this vegetable?"
          }
        },
        "required": ["veggieName", "veggieLike"]
      }
    }
  },
  "required": ["items"],
}`